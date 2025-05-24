// screens/SettingsScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, ScrollView, Button, Image } from 'react-native';
import { useNavigation, useIsFocused, CommonActions } from '@react-navigation/native';
import { auth, db } from '../firebase';
import firebase from 'firebase/compat/app'; 
import { Video, ResizeMode } from 'expo-av';
import AppText from '../components/AppText'; 
// REMOVED: import { Grayscale } from 'react-native-color-matrix-image-filters';

const difficulties = ['Easy', 'Hard']; 
const DEFAULT_LIVES_ON_RESET = 3; 
const chestIcon = require('../assets/images/icons/chest_icon.png'); 

const getCurrentDateString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const TutorialContent = () => { /* ... same as previous complete version ... */ 
  const videoPlayerRef = useRef(null); 
  const [videoStatus, setVideoStatus] = useState({}); 
  const [isVideoBuffering, setIsVideoBuffering] = useState(true); 
  const onlineVideoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'; 

  return (
    <View style={styles.subPageContentContainer}>
      <Text style={styles.subPageSectionTitle}>HOW TO PLAY</Text>
      <View style={styles.tutorialSection}><Text style={styles.tutorialHeader}>GAME OBJECTIVES:</Text><Text style={styles.tutorialText}>- Answer quizzes correctly to earn XP, complete levels, and master new themes.</Text></View>
      <View style={styles.tutorialSection}><Text style={styles.tutorialHeader}>HOW TO ANSWER:</Text><Text style={styles.tutorialText}>- Select the correct answer from the provided choices.</Text></View>
      <Text style={[styles.tutorialHeader, {marginTop: 15, textAlign:'center'}]}>Gameplay Demo:</Text>
      <View style={styles.videoContainer}>
        {isVideoBuffering && (<View style={styles.videoLoadingOverlay}><ActivityIndicator size="large" color="#FFFFFF" /><Text style={styles.videoLoadingText}>Loading Video...</Text></View>)}
        <Video ref={videoPlayerRef} style={styles.videoPlayer} source={{ uri: onlineVideoUrl }} useNativeControls resizeMode={ResizeMode.CONTAIN} isLooping={false}
          onPlaybackStatusUpdate={statusUpdate => { setVideoStatus(statusUpdate); if (statusUpdate.isLoaded || statusUpdate.didJustFinish || statusUpdate.error) setIsVideoBuffering(false); if (statusUpdate.didJustFinish && !statusUpdate.isLooping) videoPlayerRef.current?.pauseAsync(); }}
          onLoadStart={() => setIsVideoBuffering(true)} onReadyForDisplay={() => setIsVideoBuffering(false)} onError={(error) => { console.error("Video Player Error:", error); setIsVideoBuffering(false); Alert.alert("Video Error", "Could not load the tutorial video."); }}/>
      </View>
       <View style={styles.videoControls}>
          <Button title={videoStatus.isLoaded && videoStatus.isPlaying ? 'Pause' : 'Play'} onPress={() => videoStatus.isLoaded && videoStatus.isPlaying ? videoPlayerRef.current.pauseAsync() : videoPlayerRef.current.playAsync()} disabled={!videoStatus.isLoaded || isVideoBuffering} color="#446BCF"/>
        </View>
    </View>
  );
};

const LifelineContent = ({ onAttemptDailyQuestion, dailyQuestionAvailable }) => ( 
  <View style={styles.subPageContentContainer}>
    <Text style={styles.subPageSectionTitle}>CHEST OF THE DAY / LIFELINES</Text>
    {dailyQuestionAvailable ? (
        <TouchableOpacity style={styles.actionButtonLifeline} onPress={onAttemptDailyQuestion}>
            <Text style={styles.actionButtonText}>Answer Daily Question for a Life!</Text>
        </TouchableOpacity>
    ) : (
        <View style={styles.dailyQuestionAttempted}>
            <Text style={styles.dailyQuestionAttemptedText}>Daily life question already attempted today. Come back tomorrow!</Text>
        </View>
    )}
    <View style={styles.chestPlaceholder}>
        {/* Using opacity for "disabled" look if Grayscale component causes issues */}
        <Image 
            source={chestIcon} 
            style={[
                styles.chestImage, // Changed from chestIcon to avoid conflict with a text style if any
                !dailyQuestionAvailable && styles.chestImageDisabled 
            ]} 
        />
    </View>
    <Text style={styles.subPageDescription}>Successfully answer a daily question to earn an extra life. Max lives apply.</Text>
  </View>
);

const UserSettingsSubPage = ({ userData, onSaveDifficulty, isSaving, onResetGame }) => { /* ... same as previous ... */ 
  const [selectedDifficulty, setSelectedDifficulty] = useState(userData?.difficulty || 'Easy');
  useEffect(() => { setSelectedDifficulty(userData?.difficulty || 'Easy'); }, [userData?.difficulty]);
  return (
    <View style={styles.subPageContentContainer}>
      <Text style={styles.subPageSectionTitle}>GAME SETTINGS</Text>
      <View style={styles.settingEntry}><Text style={styles.settingKey}>Nickname:</Text><Text style={styles.settingVal}>{userData?.nickname || 'N/A'}</Text></View>
      <View style={styles.settingEntry}><Text style={styles.settingKey}>Email:</Text><Text style={styles.settingVal}>{userData?.email || 'N/A'}</Text></View>
      <Text style={styles.settingKeyLarge}>Difficulty Level:</Text>
      <View style={styles.settingOptionsHorizontal}>
        {difficulties.map(d => (<TouchableOpacity key={d} style={[styles.settingOptionBtn, selectedDifficulty === d && styles.selectedSettingOptionBtn]} onPress={() => setSelectedDifficulty(d)}><Text style={[styles.settingOptionText, selectedDifficulty === d && styles.selectedSettingOptionText]}>{d}</Text></TouchableOpacity>))}
      </View>
      <Text style={styles.settingKeyLarge}>My Learning Themes:</Text>
      <View style={styles.themesList}>{(userData?.learningSubjects && userData.learningSubjects.length > 0) ? userData.learningSubjects.map(subject => (<Text key={subject} style={styles.themeTag}> {subject} </Text>)) : <Text style={styles.settingVal}>No themes selected.</Text>}</View>
      <Text style={styles.noteText}>(To change themes, reset game progress.)</Text>
      <TouchableOpacity style={[styles.actionButtonSave, isSaving && styles.actionButtonDisabled]} onPress={() => onSaveDifficulty(selectedDifficulty)} disabled={isSaving}><Text style={styles.actionButtonText}>{isSaving ? <ActivityIndicator size="small" color="#fff" /> : 'Save Difficulty'}</Text></TouchableOpacity>
      <View style={styles.dangerZone}><Text style={styles.dangerZoneTitle}>Danger Zone</Text><TouchableOpacity style={styles.resetButton} onPress={onResetGame}><Text style={styles.resetButtonText}>Reset Game Progress</Text></TouchableOpacity><Text style={styles.noteText}>This erases XP, levels, mastered questions, and resets themes. Account remains.</Text></View>
    </View>
  );
};

const SettingsScreen = () => { /* ... same state and useEffects as before ... */ 
  const [activeTab, setActiveTab] = useState('Tutorial'); 
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingDifficulty, setSavingDifficulty] = useState(false);
  const [dailyQuestionAvailable, setDailyQuestionAvailable] = useState(false);
  const navigation = useNavigation(); const isFocused = useIsFocused(); const currentUser = auth.currentUser;

  useEffect(() => {
    let unsubscribeUserSnapshot = () => {}; 
    if (currentUser && isFocused) {
      setLoading(true); const userRef = db.collection('users').doc(currentUser.uid);
      unsubscribeUserSnapshot = userRef.onSnapshot(doc => {
        if (doc.exists) { const data = doc.data(); setUserData(data); const todayStr = getCurrentDateString(); setDailyQuestionAvailable(data.dailyLifeQuestionAttemptedDate !== todayStr); } 
        else { Alert.alert("Error", "User profile not found.", [{ text: "OK", onPress: () => navigation.replace('Auth')}]); }
        setLoading(false);
      }, err => { console.error("Error settings:", err); setLoading(false); });
    } else if (!currentUser && isFocused) { navigation.replace('Auth'); setLoading(false); }
    return () => { unsubscribeUserSnapshot(); };
  }, [currentUser, navigation, isFocused]);

  const handleSaveDifficulty = async (newDifficulty) => { /* ... same as before ... */  if (!currentUser || !newDifficulty) return; setSavingDifficulty(true); try { await db.collection('users').doc(currentUser.uid).update({ difficulty: newDifficulty }); Alert.alert('Success', 'Difficulty updated!'); } catch (error) { Alert.alert('Error', 'Could not save difficulty: ' + error.message); } setSavingDifficulty(false); };
  const handleSignOut = () => { /* ... same as before ... */ auth.signOut().catch(error => Alert.alert('Sign Out Error', error.message)); };
  const handleAttemptDailyQuestion = () => { /* ... same as before ... */  if (!dailyQuestionAvailable) { Alert.alert("Already Attempted", "Daily question done for today."); return; } const learningThemes = userData?.learningSubjects; if (!learningThemes || learningThemes.length === 0) { Alert.alert("No Themes", "Select learning themes first."); return; } const randomTheme = learningThemes[Math.floor(Math.random() * learningThemes.length)]; navigation.navigate('Game', { worldId: randomTheme, worldName: `${randomTheme} Daily Challenge`, level: 1, isDailyChallenge: true, dailyChallengeDifficulty: userData?.difficulty || 'Easy' }); };
  const handleResetGame = () => { /* ... same as before ... */  Alert.alert( "Reset Game Progress", "Are you sure?", [ { text: "Cancel", style: "cancel" }, { text: "Reset Progress", style: "destructive", onPress: async () => { if (!currentUser) return; setLoading(true); try { const todayStr = getCurrentDateString(); await db.collection('users').doc(currentUser.uid).set({ email: currentUser.email, createdAt: userData?.createdAt || firebase.firestore.FieldValue.serverTimestamp(), nickname: '', difficulty: 'Easy', learningSubjects: [], initialSetupComplete: false, characterLook: { overlay: 'default_look' }, lives: DEFAULT_LIVES_ON_RESET, xp: 0, currentLevelByTheme: {}, masteredQuestions: [], lastLivesResetDate: todayStr, }, { merge: true }); Alert.alert("Progress Reset", "Game progress has been reset."); navigation.dispatch( CommonActions.reset({ index: 0, routes: [{ name: 'InitialSetup' }] }) ); } catch (error) { Alert.alert("Error", "Could not reset progress: " + error.message); } setLoading(false); }}]); };
  const renderSubPage = () => { /* ... same as before ... */ if (loading || !userData) return <ActivityIndicator size="large" color="#FFFFFF" style={{marginTop: 50}}/>; switch (activeTab) { case 'Tutorial': return <TutorialContent />; case 'Lifeline': return <LifelineContent onAttemptDailyQuestion={handleAttemptDailyQuestion} dailyQuestionAvailable={dailyQuestionAvailable} />; case 'Settings': return <UserSettingsSubPage userData={userData} onSaveDifficulty={handleSaveDifficulty} isSaving={savingDifficulty} onResetGame={handleResetGame} />; default: return <TutorialContent />; }};
  if (loading && !userData) return <View style={styles.fullScreenLoader}><ActivityIndicator size="large" color="#FFFFFF" /></View>;

  return (
    <ScrollView style={styles.screenScrollView} contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.screenContainer}>
        <View style={styles.header}><TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backButtonText}>{'< Back'}</Text></TouchableOpacity><Text style={styles.mainScreenTitle}>Help & Settings</Text><View style={{width:50}} /></View>
        <View style={styles.tabButtonContainer}>{['Tutorial', 'Lifeline', 'Settings'].map(tabName => (<TouchableOpacity key={tabName} style={[styles.tabButton, activeTab === tabName && styles.activeTabButton]} onPress={() => setActiveTab(tabName)}><Text style={styles.tabButtonText}>{tabName}</Text></TouchableOpacity>))}</View>
        <View style={styles.subPageOuterContainer}>{renderSubPage()}</View>
        <View style={styles.signOutButtonContainer}><TouchableOpacity style={[styles.mainActionButtonGlobal, styles.signOutButton]} onPress={handleSignOut}><Text style={styles.mainActionButtonText}>Sign Out</Text></TouchableOpacity></View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screenScrollView: { flex: 1, backgroundColor: '#81A9FF'},
  screenContainer: { flexGrow: 1, paddingBottom: 20, justifyContent:'space-between' },
  fullScreenLoader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#81A9FF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop:50, paddingHorizontal: 20},
  backButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold'},
  mainScreenTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', fontFamily: 'Jockey One' },
  tabButtonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20, paddingHorizontal: 10 },
  tabButton: { backgroundColor: '#A8C0FF', paddingVertical: 10, borderRadius: 20, flex:1, marginHorizontal:5, alignItems: 'center', borderWidth: 1, borderColor: '#FFF'},
  activeTabButton: { backgroundColor: '#446BCF', borderColor: '#FFD700', borderWidth: 2 },
  tabButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', textAlign:'center' },
  subPageOuterContainer: { marginHorizontal: 15, backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 10, padding:15, marginBottom: 20, flexGrow:1 },
  subPageContentContainer: { paddingBottom:10 },
  subPageSectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 20, textAlign: 'center', fontFamily: 'Jockey One' },
  subPageDescription: { fontSize: 14, color: '#E0E0E0', textAlign: 'center', marginTop:15, lineHeight: 20 },
  noteText: {fontSize:11, color:'rgba(255,255,255,0.7)', textAlign:'center', marginTop:10, marginBottom:10},
  tutorialSection: { marginBottom: 20, paddingHorizontal:5 },
  tutorialHeader: { fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 5 },
  tutorialText: { fontSize: 14, color: '#E0E0E0', lineHeight: 20, marginLeft: 10 },
  videoContainer: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000', borderRadius: 8, marginBottom: 5, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  videoPlayer: { width: '100%', height: '100%' },
  videoLoadingOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  videoLoadingText: { color: '#FFF', marginTop: 8 },
  videoControls: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 8 },
  chestPlaceholder: { height: 150, width: 150, /* backgroundColor: 'rgba(212, 175, 55, 0.5)', // Removed bg, rely on image */ borderRadius: 15, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 15, /* borderWidth:3, borderColor: '#B8860B' */ },
  chestImage: { // Renamed from chestIcon to avoid conflict with text-based emoji styles elsewhere
    width: 120, // Adjust to your actual chest icon size
    height: 120,
    resizeMode: 'contain',
  },
  chestImageDisabled: {
    opacity: 0.5, // Makes the image look faded/grayed out
  },
  chestInfoText: {color: '#fff', marginTop:5, fontSize:13, fontWeight:'500'}, // This style might not be needed if image fills placeholder
  actionButtonLifeline: { backgroundColor: '#5cb85c', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8, alignSelf: 'center', marginVertical: 15 },
  actionButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }, 
  dailyQuestionAttempted: { paddingVertical:12, alignItems:'center', marginVertical:15},
  dailyQuestionAttemptedText: { color: '#FFD700', fontStyle:'italic', textAlign:'center'},
  settingEntry: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical:10, borderBottomWidth:1, borderBottomColor: 'rgba(255,255,255,0.15)'},
  settingKey: { fontSize: 15, fontWeight: '500', color: '#E0E0E0' },
  settingKeyLarge: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginBottom: 10, marginTop:15 },
  settingVal: { fontSize: 15, color: '#FFFFFF', flexShrink:1, textAlign:'right' },
  settingOptionsHorizontal: { flexDirection: 'row', justifyContent: 'space-around', marginBottom:20 },
  settingOptionBtn: { flex:1, marginHorizontal:5, backgroundColor: '#A8C0FF', paddingVertical: 10, borderRadius: 8, alignItems:'center', borderWidth:1, borderColor:'#FFF'},
  selectedSettingOptionBtn: { backgroundColor: '#446BCF', borderColor:'#FFD700' },
  settingOptionText: { color: '#333', fontSize: 14, fontWeight: 'bold' },
  selectedSettingOptionText: { color: '#FFFFFF'},
  themesList: { marginBottom:5, paddingLeft:5, flexDirection:'row', flexWrap:'wrap' },
  themeTag: { fontSize:14, color:'#FFF', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal:8, paddingVertical:4, borderRadius:10, marginRight:5, marginBottom:5},
  actionButtonSave: { backgroundColor: '#4CAF50', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop:15 },
  actionButtonDisabled: { backgroundColor: '#a5d6a7'},
  dangerZone: { marginTop: 25, paddingTop:15, borderTopWidth:1, borderTopColor:'rgba(255,0,0,0.2)'},
  dangerZoneTitle: {fontSize: 16, color: '#FF6B6B', fontWeight:'bold', textAlign:'center', marginBottom:10},
  resetButton: { backgroundColor: '#D32F2F', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  resetButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  signOutButtonContainer: { paddingHorizontal: 15, paddingBottom:10 }, 
  mainActionButtonGlobal: { paddingVertical: 15, borderRadius: 25, alignItems: 'center', marginTop: 10 }, 
  signOutButton: { backgroundColor: '#f44336' },
  mainActionButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default SettingsScreen;