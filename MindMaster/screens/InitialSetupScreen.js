// screens/InitialSetupScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { auth, db } from '../firebase';
import firebase from 'firebase/compat/app';
import AppText from '../components/AppText';

// This list should contain all themes you want users to be able to pick from.
// It should align with themes defined in QuestionService.js and your JSON files.
export const allAvailableThemes = ["English", "Geography", "History", "Mathematics", "Physics", "Science"]; 
const difficulties = ['Easy', 'Hard']; 

const MaterialItem = ({ name, onPress, isSelected }) => (
  <TouchableOpacity 
    style={[styles.materialItem, isSelected && styles.selectedMaterialItem]}
    onPress={onPress}
  >
    <Text style={[styles.materialText, isSelected && styles.selectedMaterialText]}>{name}</Text>
  </TouchableOpacity>
);

const InitialSetupScreen = () => {
  const [yourName, setYourName] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Easy');
  const [selectedThemes, setSelectedThemes] = useState([]); // User's chosen themes
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      console.warn("InitialSetupScreen: No current user, redirecting to Auth.");
      navigation.replace('Auth');
    } else {
      // Pre-fill logic (optional, good for robustness if user somehow re-enters)
      db.collection('users').doc(currentUser.uid).get().then(doc => {
        if (doc.exists) {
          const data = doc.data();
          if (data.nickname) setYourName(data.nickname);
          const savedDifficulty = data.difficulty && difficulties.find(d => d.toLowerCase() === data.difficulty.toLowerCase());
          setSelectedDifficulty(savedDifficulty || 'Easy');
          if (data.learningSubjects && Array.isArray(data.learningSubjects)) {
            setSelectedThemes(data.learningSubjects);
          }
        }
      }).catch(err => console.log("Error fetching pre-fill data for InitialSetup:", err));
    }
  }, [currentUser, navigation]);

  const toggleThemeSelection = (themeName) => {
    setSelectedThemes(prev => 
      prev.includes(themeName) 
        ? prev.filter(t => t !== themeName) 
        : [...prev, themeName]
    );
  };

  const handleCompleteSetup = async () => {
    if (!yourName.trim()) { Alert.alert('Error', 'Please enter your name.'); return; }
    if (selectedThemes.length === 0) { Alert.alert('Error', 'Please select at least one Theme to learn.'); return; }
    if (!currentUser) { Alert.alert('Error', 'No user logged in.'); navigation.replace('Auth'); return; }

    setLoading(true);
    try {
      const initialLevelsByTheme = {};
      selectedThemes.forEach(theme => {
        initialLevelsByTheme[theme] = 0; // Highest completed level for this theme is 0 (so level 1 is next)
      });

      await db.collection('users').doc(currentUser.uid).set({
        email: currentUser.email, // Preserve email from auth
        nickname: yourName,
        difficulty: selectedDifficulty, // 'Easy' or 'Hard'
        learningSubjects: selectedThemes, // Array of chosen theme names
        language: 'English', // Default, can be an option later
        initialSetupComplete: true,
        characterLook: { overlay: 'default_look' }, // Default character
        lives: 3, 
        xp: 0, 
        currentLevelByTheme: initialLevelsByTheme, // Key for tracking progress
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      console.log("InitialSetupScreen: Setup complete. Navigating to MainApp.");
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'MainApp' }] }));
    } catch (error) {
      console.error("InitialSetupScreen: Error completing setup: ", error);
      Alert.alert('Error', 'Could not save your settings: ' + error.message);
    }
    setLoading(false);
  };

  if (!currentUser && !loading) { 
    return <View style={styles.centeredLoading}><ActivityIndicator size="large" color="#FFFFFF" /></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.mainTitle}>Mind Master</Text>
        <Text style={styles.welcomeText}>Personalize your learning journey.</Text>
        <Text style={styles.label}>Your Name:</Text>
        <TextInput style={styles.input} placeholder="Your game name" value={yourName} onChangeText={setYourName} />
        
        <Text style={styles.label}>Choose Themes to learn:</Text>
        <ScrollView horizontal contentContainerStyle={styles.materialsHorizontalScroll} style={styles.materialsWrapper}>
            <View style={styles.materialsContainer}>
            {allAvailableThemes.map(theme => (
                <MaterialItem 
                    key={theme} 
                    name={theme} 
                    isSelected={selectedThemes.includes(theme)} 
                    onPress={() => toggleThemeSelection(theme)} 
                />
            ))}
            </View>
        </ScrollView>
        
        <Text style={styles.label}>Choose your difficulty:</Text>
        <View style={styles.difficultyContainer}>
          {difficulties.map(d => (
            <TouchableOpacity key={d} style={[styles.difficultyBox, selectedDifficulty === d && styles.selectedDifficultyBox]} onPress={() => setSelectedDifficulty(d)}>
              <Text style={[styles.difficultyBoxText, selectedDifficulty === d && styles.selectedDifficultyBoxText]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleCompleteSetup} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Start Learning!</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#81A9FF' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 30 },
  centeredLoading: { flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#81A9FF' },
  mainTitle: { fontSize: 36, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 15, textAlign: 'center', fontFamily: 'Jockey One' },
  welcomeText: { fontSize: 16, color: '#F0F0F0', textAlign: 'center', marginBottom: 20, paddingHorizontal: 10, lineHeight: 22 },
  label: { fontSize: 18, color: '#FFFFFF', alignSelf: 'flex-start', width: '90%', marginLeft: '5%', marginBottom: 8, fontWeight: '600' },
  input: { width: '90%', backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, marginBottom: 20, fontSize: 16, color: '#333' },
  materialsWrapper: { maxHeight: 130, width:'90%', marginBottom:20}, // Wrapper for horizontal scroll
  materialsHorizontalScroll: { },
  materialsContainer: { flexDirection: 'row', flexWrap: 'nowrap', // No wrap for horizontal scroll
    paddingVertical: 5, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 5 },
  materialItem: { backgroundColor: '#A8C0FF', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, marginHorizontal: 5, borderWidth: 1, borderColor: '#FFFFFF', height: 45, justifyContent:'center'},
  selectedMaterialItem: { backgroundColor: '#446BCF', borderColor: '#FFD700' },
  materialText: { color: '#333', fontSize: 13 },
  selectedMaterialText: { color: '#FFFFFF', fontWeight: 'bold' },
  difficultyContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '90%', marginBottom: 30 },
  difficultyBox: { flex: 1, marginHorizontal: 10, paddingVertical: 15, backgroundColor: '#A8C0FF', borderRadius: 8, borderWidth: 2, borderColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  selectedDifficultyBox: { backgroundColor: '#446BCF', borderColor: '#FFD700' },
  difficultyBoxText: { color: '#333', fontSize: 14, fontWeight: 'bold' },
  selectedDifficultyBoxText: { color: '#FFFFFF' },
  button: { backgroundColor: '#446BCF', paddingVertical: 15, borderRadius: 25, width: '90%', alignItems: 'center', marginTop: 10, elevation: 3 },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});

export default InitialSetupScreen;