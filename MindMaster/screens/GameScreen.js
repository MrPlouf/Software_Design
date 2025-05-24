// screens/GameScreen.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native'; 
import { getRandomQuestionsForThemeLevelDifficulty } from '../services/QuestionService'; 
import { db, auth } from '../firebase'; 
import firebase from 'firebase/compat/app'; 
import AppText from '../components/AppText';

const playerSprite = require('../assets/images/characters/overlays/default_look.png'); 
const enemySprite = require('../assets/images/characters/enemy_generic.png'); 

const characterImageLookupForGame = {
  'default_look': require('../assets/images/characters/overlays/default_look.png'),
  'male_knight_overlay': require('../assets/images/characters/overlays/male_knight_overlay.png'),
  'female_mage_overlay': require('../assets/images/characters/overlays/female_mage_overlay.png'),
  'male_archer_overlay': require('../assets/images/characters/overlays/male_archer_overlay.png'),
};

const DEFAULT_LIVES_CONSTANT = 3;
const XP_PER_PLAYER_LEVEL = 500; // Still needed if GameScreen handles XP for regular levels
const REQUIRED_CORRECT_PERCENTAGE_TO_PASS = 0.5;
const QUESTIONS_FOR_DAILY_CHALLENGE = 1;
const QUESTIONS_PER_REGULAR_LEVEL = 5;

// Helper function for current date string
const getCurrentDateString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};


const GameScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // isDailyChallenge and dailyChallengeDifficulty are key params
  const { worldId: themeName, worldName, level, isDailyChallenge, dailyChallengeDifficulty } = route.params;

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [userInitialDifficulty, setUserInitialDifficulty] = useState('Easy'); // Effective difficulty for the quiz
  const [userLives, setUserLives] = useState(DEFAULT_LIVES_CONSTANT); // UI display, updated from Firestore
  const [userXP, setUserXP] = useState(0); // UI display
  const [userCharacterLookSource, setUserCharacterLookSource] = useState(playerSprite);

  const [answeredCurrentLevel, setAnsweredCurrentLevel] = useState([]);
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);
  const [feedbackType, setFeedbackType] = useState('');
  const [showFeedbackOverlay, setShowFeedbackOverlay] = useState(false);
  const [isLevelOver, setIsLevelOver] = useState(false);
  const [levelResult, setLevelResult] = useState(null);

  const currentUser = auth.currentUser;
  const feedbackTimeoutRef = useRef(null);

  const loadGameDataAsync = useCallback(async () => {
    if (!currentUser) { Alert.alert("Error", "User not logged in."); navigation.goBack(); setLoading(false); return; }
    console.log("GameScreen: loadGameDataAsync for", isDailyChallenge ? `Daily ${themeName}` : `${themeName} Lvl ${level}`);
    setLoading(true);
    setIsLevelOver(false); setLevelResult(null); setCurrentQuestionIndex(0);
    setAnsweredCurrentLevel([]); setSelectedChoiceId(null); setFeedbackType(''); setShowFeedbackOverlay(false);

    try {
      const userDoc = await db.collection('users').doc(currentUser.uid).get();
      let difficultyForQuery = 'Easy'; 
      let characterOverlayKey = 'default_look';

      if (userDoc.exists) {
          const userData = userDoc.data();
          difficultyForQuery = isDailyChallenge ? (dailyChallengeDifficulty || 'Easy') : (userData.difficulty?.toLowerCase() === 'hard' ? 'Hard' : 'Easy');
          setUserInitialDifficulty(difficultyForQuery); 
          setUserLives(userData.lives ?? DEFAULT_LIVES_CONSTANT);
          setUserXP(userData.xp ?? 0);
          characterOverlayKey = userData.characterLook?.overlay || 'default_look';
          setUserCharacterLookSource(characterImageLookupForGame[characterOverlayKey] || characterImageLookupForGame['default_look']);
      } else { 
          setUserCharacterLookSource(characterImageLookupForGame['default_look']); 
          console.warn("GameScreen: User document not found. This might affect saving progress.");
          if (isDailyChallenge) { // Critical for daily challenge as we need to update attempt date
            Alert.alert("Error", "User profile not found. Cannot proceed with daily challenge.");
            navigation.goBack(); setLoading(false); return;
          }
      }
      
      const numQuestionsToFetch = isDailyChallenge ? QUESTIONS_FOR_DAILY_CHALLENGE : QUESTIONS_PER_REGULAR_LEVEL;
      // For daily challenge, level might be a fixed "daily" level or just 1. themeName is used to pick a question.
      const questionLevelForQuery = isDailyChallenge ? 1 : level; // Or some other logic for daily question level from DB
      
      const fetchedQuestions = getRandomQuestionsForThemeLevelDifficulty(themeName, questionLevelForQuery, difficultyForQuery, numQuestionsToFetch);
      
      if (fetchedQuestions && fetchedQuestions.length > 0) {
        setQuestions(fetchedQuestions);
      } else {
        setQuestions([]);
        Alert.alert("No Questions", `No questions available for this ${isDailyChallenge ? 'daily challenge' : 'level'}.`);
      }
    } catch (error) { 
      Alert.alert("Error", "Could not load data for this activity."); 
      console.error("GameScreen load error:", error);
      setQuestions([]); 
    } 
    finally { setLoading(false); }
  }, [currentUser, themeName, level, navigation, isDailyChallenge, dailyChallengeDifficulty]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (isActive) loadGameDataAsync();
      return () => { isActive = false; if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current); };
    }, [loadGameDataAsync])
  );

  const handleNextAfterFeedback = useCallback(() => {
    if (feedbackTimeoutRef.current) { clearTimeout(feedbackTimeoutRef.current); feedbackTimeoutRef.current = null; }
    setShowFeedbackOverlay(false); 
    setSelectedChoiceId(null); 
    setFeedbackType('');

    if (isDailyChallenge || currentQuestionIndex >= questions.length - 1) {
      setIsLevelOver(true); // This will trigger processLevelEnd
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, questions.length, isDailyChallenge]);

  const handleAnswerPress = (choice) => {
    if (feedbackType || !questions[currentQuestionIndex]) return; 
    
    const isCorrect = choice.isCorrect;
    setSelectedChoiceId(choice.id || choice.letter);
    setFeedbackType(isCorrect ? 'correct' : 'incorrect');
    setShowFeedbackOverlay(true);
    
    const currentQ = questions[currentQuestionIndex];
    const newAnswer = { questionId: currentQ.id || currentQ.questionText, questionText: currentQ.questionText, correct: isCorrect };
    setAnsweredCurrentLevel(prev => [...prev, newAnswer]); // Only one answer for daily challenge
    
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    // For daily challenge, the "Next Question" button in overlay will handle advancing to result.
    // For regular levels, can keep auto-advance.
    if (!isDailyChallenge) {
        feedbackTimeoutRef.current = setTimeout(() => { 
            handleNextAfterFeedback(); // Use the new unified advance function
            feedbackTimeoutRef.current = null;
        }, 2000); 
    }
  };

  useEffect(() => { 
    if (isLevelOver && answeredCurrentLevel.length > 0 && questions.length > 0) { // Ensure answeredCurrentLevel is populated
      const process = async () => { 
          if (!currentUser) return;
          const correctCount = answeredCurrentLevel.filter(a => a.correct).length;
          const userDocRef = db.collection('users').doc(currentUser.uid);
          const updates = {};
          let calculatedXPChange = 0; let lifeChange = 0;
          let passed = false;

          const userDocSnap = await userDocRef.get();
          const userDataFromServer = userDocSnap.exists ? userDocSnap.data() : { lives: DEFAULT_LIVES_CONSTANT, xp: 0, currentLevelByTheme: {}, masteredQuestions: [] };
          let currentServerLives = userDataFromServer.lives ?? DEFAULT_LIVES_CONSTANT;
          let currentServerXP = userDataFromServer.xp ?? 0;    

          if (isDailyChallenge) {
              passed = correctCount > 0; // Only one question, so correctCount is 0 or 1
              if (passed) {
                  updates.lives = Math.min(currentServerLives + 1, 5); // Cap max lives, e.g., at 5
                  lifeChange = 1; 
              }
              // Always mark as attempted for the day, regardless of pass/fail
              updates.dailyLifeQuestionAttemptedDate = getCurrentDateString();
          } else { 
              const successRate = correctCount / questions.length;
              passed = successRate >= REQUIRED_CORRECT_PERCENTAGE_TO_PASS;
              if (passed) {
                  calculatedXPChange = 100; updates.xp = currentServerXP + calculatedXPChange;
                  const currentProgressByTheme = userDataFromServer.currentLevelByTheme || {};
                  if (level > (currentProgressByTheme[themeName] || 0)) updates[`currentLevelByTheme.${themeName}`] = level;
                  const newMastered = answeredCurrentLevel.filter(a=>a.correct).map(a => ({ questionId: a.questionId, questionText: a.questionText, themeName: themeName, levelAnswered: level, masteredAt: new Date() }));
                  if (newMastered.length > 0) {
                    const existingMastered = userDataFromServer.masteredQuestions || [];
                    const map = new Map(existingMastered.map(item => [item.questionId, item]));
                    newMastered.forEach(item => map.set(item.questionId, item));
                    updates.masteredQuestions = Array.from(map.values());
                  }
              } else {
                  lifeChange = -1; updates.lives = Math.max(0, currentServerLives + lifeChange);
              }
          }
          try { if (Object.keys(updates).length > 0) await userDocRef.update(updates); } 
          catch (error) { console.error("Firestore update error:", error); Alert.alert("Save Error", "Progress save failed."); }
          
          setLevelResult({ 
              passed, 
              correctCount, 
              totalQuestions: questions.length, 
              xpGained: calculatedXPChange, 
              lifeLost: lifeChange < 0, 
              lifeGained: lifeChange > 0, 
              finalLives: updates.lives !== undefined ? updates.lives : currentServerLives, 
              isDailyChallenge 
          });
      };
      process();
    }
    return () => { if(feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current); }
  }, [isLevelOver, answeredCurrentLevel, questions, currentUser, themeName, level, navigation, userLives, userXP, isDailyChallenge]);

  const getChoiceStyle = (choice) => selectedChoiceId === (choice.id || choice.letter) ? (feedbackType === 'correct' ? styles.correctAnswerButton : styles.incorrectAnswerButton) : styles.answerButton;
  const currentQuestion = questions[currentQuestionIndex];
  const progressBarSegments = questions.length > 0 ? questions.length : (isDailyChallenge ? QUESTIONS_FOR_DAILY_CHALLENGE : QUESTIONS_PER_REGULAR_LEVEL);

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#FFFFFF" /></View>;
  if (!isLevelOver && (!questions || questions.length === 0)) return <View style={styles.centered}><Text style={styles.title}>No Questions</Text><Text style={styles.infoText}>For: {isDailyChallenge ? `Daily ${themeName}` : `${themeName} L${level}`} ({userInitialDifficulty})</Text><TouchableOpacity style={styles.actionButton} onPress={() => navigation.goBack()}><Text style={styles.actionButtonText}>Back</Text></TouchableOpacity></View>;
  
  if (isLevelOver && levelResult) {
    return (
        <View style={styles.resultContainer}>
            <Image source={userCharacterLookSource} style={styles.resultCharacterImage} resizeMode="contain" />
            <Text style={styles.resultTitle}>
                {levelResult.isDailyChallenge ? `Daily Challenge: ${worldName}` : `${worldName} - Level ${level} Results`}
            </Text>
            <Text style={styles.resultText}>Questions Answered: {levelResult.totalQuestions}</Text>
            <Text style={styles.resultText}>Right Answers: {levelResult.correctCount}</Text>
            {!levelResult.isDailyChallenge && (
                <>
                <Text style={styles.resultText}>Success Rate: {((levelResult.correctCount / levelResult.totalQuestions) * 100 || 0).toFixed(0)}%</Text>
                <Text style={styles.resultText}>Threshold: {(REQUIRED_CORRECT_PERCENTAGE_TO_PASS * 100).toFixed(0)}%</Text>
                </>
            )}
            {levelResult.passed ? (
                <View style={styles.resultFeedbackGood}>
                    <Text style={styles.resultFeedbackTextWin}>{levelResult.isDailyChallenge ? "CORRECT!" : "CONGRATS! YOU WIN"}</Text>
                    {levelResult.xpGained > 0 && <Text style={styles.resultXpText}>+{levelResult.xpGained} XP</Text>}
                    {levelResult.lifeGained && <Text style={styles.resultXpText}>+1 LIFE!</Text>}
                </View>
            ) : (
                <View style={styles.resultFeedbackBad}>
                    <Text style={styles.resultFeedbackTextLose}>{levelResult.isDailyChallenge ? "INCORRECT" : "TOO BAD :("}</Text>
                    {levelResult.lifeLost && <Text style={styles.resultLifeText}>-1 LIFE</Text>}
                    {levelResult.finalLives <= 0 && !levelResult.isDailyChallenge && <Text style={[styles.resultLifeText, {color: 'red', marginTop:5}]}>NO LIVES!</Text>}
                </View>
            )}
            {!levelResult.isDailyChallenge && (levelResult.finalLives > 0 || levelResult.passed) && (
                <TouchableOpacity style={[styles.actionButton, styles.retryButton]} onPress={loadGameDataAsync}>
                    <Text style={styles.actionButtonText}>Retry Level</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity 
                style={[styles.actionButton, styles.mapButton]} 
                onPress={() => levelResult.isDailyChallenge ? navigation.goBack() : navigation.navigate('ExplorationMap')}
            >
                <Text style={styles.actionButtonText}>{levelResult.isDailyChallenge ? "Back to Settings" : "Go to Map"}</Text>
            </TouchableOpacity>
        </View>
    );
  }

  if (!currentQuestion || !currentQuestion.choices) return <View style={styles.centered}><Text style={styles.title}>Error question data.</Text><TouchableOpacity style={styles.actionButton} onPress={loadGameDataAsync}><Text style={styles.actionButtonText}>Reload</Text></TouchableOpacity></View>;

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}><TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backText}>{'< Exit'}</Text></TouchableOpacity><Text style={styles.levelHeaderTxt}>{isDailyChallenge ? `Daily: ${worldName}` : `${worldName} - Lvl ${level}`}</Text><View style={styles.livesContainer}><Text style={styles.livesText}>❤️ {userLives}</Text></View></View>
      {!isDailyChallenge && <View style={styles.progressBarOuter}>{Array(progressBarSegments).fill(0).map((_, i) => <View key={i} style={[styles.progressSegmentBase, i < answeredCurrentLevel.length ? (answeredCurrentLevel[i].correct ? styles.progressSegmentCorrect : styles.progressSegmentIncorrect) : styles.progressSegmentPending]} />)}</View>}
      {!isDailyChallenge && <Text style={styles.progressDetailsText}>{`Need ${Math.ceil(progressBarSegments * REQUIRED_CORRECT_PERCENTAGE_TO_PASS)} correct to pass`}</Text>}
      <View style={styles.gameArena}><Image source={userCharacterLookSource} style={styles.characterSprite} resizeMode="contain" /><Image source={enemySprite} style={styles.enemySprite} resizeMode="contain" /></View>
      <View style={styles.questionBox}><Text style={styles.questionTextContent}>{currentQuestion.questionText}</Text></View>
      <View style={styles.choicesGrid}>{currentQuestion.choices.map((choice) => <TouchableOpacity key={choice.id || choice.letter} style={getChoiceStyle(choice)} onPress={() => handleAnswerPress(choice)} disabled={!!feedbackType}><Text style={styles.choiceText}>{choice.text}</Text></TouchableOpacity>)}</View>
      {showFeedbackOverlay && (
        <View style={styles.feedbackOverlay}>
          <Image source={userCharacterLookSource} style={styles.feedbackCharacterImage} resizeMode="contain" />
          <Text style={styles.feedbackText}>{feedbackType === 'correct' ? 'Success!' : 'WRONG ANSWER'}</Text>
          <TouchableOpacity style={styles.feedbackButton} onPress={handleNextAfterFeedback} > 
            <Text style={styles.feedbackButtonText}>{isDailyChallenge ? 'View Result' : 'Next Question'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: 10, paddingHorizontal:15, backgroundColor: '#81A9FF' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#81A9FF', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 15 },
  infoText: { fontSize: 16, color: '#FFFFFF', textAlign: 'center', marginBottom: 20, paddingHorizontal:10 },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 35 },
  backText: { color: '#FFF', fontSize: 16, fontWeight: 'bold'},
  levelHeaderTxt: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', fontFamily: 'Jockey One', flex:1, textAlign:'center' },
  livesContainer: { paddingHorizontal:10, paddingVertical: 5, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius:10 },
  livesText: { color: '#FFF', fontSize: 16, fontWeight: 'bold'},
  progressBarOuter: { flexDirection: 'row', height: 12, width: '100%', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 6, marginBottom: 3, overflow: 'hidden', borderWidth:1, borderColor: 'rgba(255,255,255,0.3)'},
  progressSegmentBase: { flex: 1, marginHorizontal: 0.5, borderRadius: 4},
  progressSegmentPending: { backgroundColor: '#777' }, 
  progressSegmentCorrect: { backgroundColor: '#4CAF50' }, 
  progressSegmentIncorrect: { backgroundColor: '#F44336' }, 
  progressDetailsText: { fontSize: 11, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: 12 },
  gameArena: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 110, marginBottom: 10 },
  characterSprite: { width: 70, height: 90 },
  enemySprite: { width: 90, height: 110 },
  questionBox: { backgroundColor: 'rgba(0,0,0,0.25)', padding: 15, borderRadius: 10, marginBottom: 15, minHeight: 90, justifyContent: 'center', borderWidth:1, borderColor: 'rgba(255,255,255,0.2)' },
  questionTextContent: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', textAlign: 'center' },
  choicesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  answerButton: { backgroundColor: '#446BCF', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 8, width: '48.5%', marginBottom: 10, alignItems: 'center', minHeight: 60, justifyContent:'center', borderWidth:1, borderColor:'#30509F' },
  correctAnswerButton: { backgroundColor: '#388E3C', paddingVertical: 12,paddingHorizontal: 8, borderRadius: 8, width: '48.5%', marginBottom: 10, alignItems: 'center', minHeight: 60, justifyContent:'center', borderWidth:1, borderColor:'#2E7D32' },
  incorrectAnswerButton: { backgroundColor: '#D32F2F', paddingVertical: 12,paddingHorizontal: 8, borderRadius: 8, width: '48.5%', marginBottom: 10, alignItems: 'center', minHeight: 60, justifyContent:'center', borderWidth:1, borderColor:'#C62828'},
  choiceText: { color: '#FFFFFF', fontSize: 13, fontWeight: '500', textAlign: 'center' },
  feedbackOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(129, 169, 255, 0.95)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  feedbackCharacterImage: { width: 150, height: 180, marginBottom: 20 },
  feedbackText: { fontSize: 36, fontWeight: 'bold', color: '#FFF', marginBottom: 30, fontFamily: 'Jockey One', textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: {width: 2, height: 2}, textShadowRadius: 3 },
  feedbackButton: { backgroundColor: '#446BCF', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 10 },
  feedbackButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#81A9FF' },
  resultCharacterImage: { width: 120, height: 150, marginBottom: 15 },
  resultTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginBottom: 10, fontFamily: 'Jockey One', textAlign: 'center'},
  resultText: { fontSize: 15, color: '#FFF', marginBottom: 3, lineHeight: 20, textAlign: 'center' },
  resultFeedbackGood: { backgroundColor: 'rgba(76, 175, 80, 0.3)', paddingVertical: 8, paddingHorizontal:15, borderRadius: 5, marginVertical: 10, alignItems: 'center', borderWidth:1, borderColor: '#4CAF50' },
  resultFeedbackTextWin: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  resultXpText: { fontSize: 16, color: '#FFF', marginTop: 5 },
  resultFeedbackBad: { backgroundColor: 'rgba(244, 67, 54, 0.3)', paddingVertical: 8,paddingHorizontal:15, borderRadius: 5, marginVertical: 10, alignItems: 'center', borderWidth:1, borderColor: '#F44336' },
  resultFeedbackTextLose: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  resultLifeText: { fontSize: 16, color: '#FFF', marginTop: 5 },
  actionButton: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, marginTop: 15, minWidth: 150, alignItems: 'center'},
  actionButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  retryButton: { backgroundColor: '#FFA000' },
  mapButton: { backgroundColor: '#446BCF' },
});

export default GameScreen;