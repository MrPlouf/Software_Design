// screens/InitialSetupScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebase';
import firebase from 'firebase/compat/app';

// Example school materials - these could come from a config or Firestore
const allSchoolMaterials = [
  "Mathematics", "Science", "History", "Geography", 
  "Literature", "Physics", "Chemistry", "Biology", 
  "Art", "Music", "Computer Science", "Economics"
];
const difficulties = ['Easy', 'Medium', 'Hard', 'Expert'];

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
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [selectedMaterials, setSelectedMaterials] = useState([]); // Array to hold selected subjects
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      console.warn("InitialSetupScreen: No current user, redirecting to Auth.");
      navigation.replace('Auth');
    } else {
      // Optional: Pre-fill if data exists (e.g., user re-enters setup)
      db.collection('users').doc(currentUser.uid).get().then(doc => {
        if (doc.exists && doc.data().nickname) {
          setYourName(doc.data().nickname);
          setSelectedDifficulty(doc.data().difficulty ? dificuldades.find(d => d.toLowerCase() === doc.data().difficulty) || 'Medium' : 'Medium');
          setSelectedMaterials(doc.data().learningSubjects || []);
        }
      }).catch(err => console.log("Error fetching pre-fill data for setup:", err));
    }
  }, [currentUser, navigation]);

  const toggleMaterialSelection = (material) => {
    setSelectedMaterials(prevSelected => {
      if (prevSelected.includes(material)) {
        return prevSelected.filter(item => item !== material);
      } else {
        if (prevSelected.length < 4) { // Limit to 4 selections
          return [...prevSelected, material];
        }
        Alert.alert("Selection Limit", "You can select up to 4 school materials.");
        return prevSelected;
      }
    });
  };

  const handleCompleteSetup = async () => {
    if (!yourName.trim()) {
      Alert.alert('Error', 'Please enter your name.');
      return;
    }
    if (selectedMaterials.length === 0) {
      Alert.alert('Error', 'Please select at least one school material to learn.');
      return;
    }
    if (selectedMaterials.length > 4) { // Should be prevented by UI but good to check
        Alert.alert('Error', 'You can select a maximum of 4 school materials.');
        return;
    }
    if (!currentUser) {
      Alert.alert('Error', 'No user logged in. Please restart the app.');
      setLoading(false);
      navigation.replace('Auth');
      return;
    }

    setLoading(true);
    try {
      await db.collection('users').doc(currentUser.uid).set({
        email: currentUser.email, // Make sure email is preserved
        nickname: yourName,
        difficulty: selectedDifficulty.toLowerCase(),
        learningSubjects: selectedMaterials, // Save selected materials
        language: 'English', // Default or can be added as an option
        initialSetupComplete: true, // Crucial: set this to true
        characterLook: { head: 'default_head', weapon: 'default_weapon' },
        lives: 3,
        progress: { highestLevelCompleted: 0, completedLevels: {} },
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }, { merge: true }); // merge: true to update existing doc or create if not present

      console.log("InitialSetupScreen: Setup complete. Navigating to MainApp.");
      navigation.replace('MainApp'); // Navigate to the main application stack
    } catch (error) {
      console.error("Error completing setup: ", error);
      Alert.alert('Error', 'Could not save your settings: ' + error.message);
    }
    setLoading(false);
  };

  if (!currentUser) { // Render loading or nothing if current user is briefly null
    return <View style={styles.container}><ActivityIndicator size="large" color="#FFFFFF" /></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.mainTitle}>Mind Master</Text>
        <Text style={styles.welcomeText}>
          Hello Traveler: Welcome to the world of MindMaster, your goal? Learn your way through the world and become the Mind Master!
        </Text>
        
        <Text style={styles.label}>Your Name:</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="#A9A9A9"
          value={yourName}
          onChangeText={setYourName}
        />

        <Text style={styles.label}>Choose up to 4 School Materials to learn:</Text>
        <View style={styles.materialsContainer}>
          {allSchoolMaterials.map(material => (
            <MaterialItem 
              key={material}
              name={material}
              isSelected={selectedMaterials.includes(material)}
              onPress={() => toggleMaterialSelection(material)}
            />
          ))}
        </View>
        <Text style={styles.selectionCountText}>Selected: {selectedMaterials.length}/4</Text>


        <Text style={styles.label}>Chosen difficulty:</Text>
        <View style={styles.difficultyContainer}>
          {difficulties.map((diff) => (
            <TouchableOpacity
              key={diff}
              style={[
                styles.difficultyBox,
                selectedDifficulty === diff && styles.selectedDifficultyBox,
              ]}
              onPress={() => setSelectedDifficulty(diff)}
            >
              <Text style={[
                  styles.difficultyBoxText,
                  selectedDifficulty === diff && styles.selectedDifficultyBoxText
              ]}>{diff}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCompleteSetup} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Let's Go!</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#81A9FF',
  },
  container: {
    flex: 1, // Takes available space in ScrollView
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    // backgroundColor: '#81A9FF', // Moved to scrollContainer
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Jockey One',
  },
  welcomeText: {
    fontSize: 16,
    color: '#F0F0F0',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  label: {
    fontSize: 18,
    color: '#FFFFFF',
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12, // Slightly less padding
    borderRadius: 10, 
    marginBottom: 15, // Reduced margin
    fontSize: 16,
    color: '#333',
  },
  materialsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Align items to the start
    width: '90%',
    marginBottom: 5,
    maxHeight: 200, // Added maxHeight for scrollability within the main scroll
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 5,
    borderRadius: 5,
  },
  materialItem: {
    backgroundColor: '#A8C0FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  selectedMaterialItem: {
    backgroundColor: '#446BCF',
    borderColor: '#FFD700',
  },
  materialText: {
    color: '#333', // Darker text for better readability on light blue
    fontSize: 12,
  },
  selectedMaterialText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  selectionCountText: {
    width: '90%',
    textAlign: 'right',
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 15,
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 25, // Reduced margin
  },
  difficultyBox: {
    // width: '22%', // For 4 square boxes
    flex: 1, // Make them take equal space
    marginHorizontal: 4,
    paddingVertical: 12,
    backgroundColor: '#A8C0FF', 
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDifficultyBox: {
    backgroundColor: '#446BCF', 
    borderColor: '#FFD700',
  },
  difficultyBoxText: {
    color: '#333',
    fontSize: 12, // Smaller text for difficulty
    fontWeight: 'bold',
  },
  selectedDifficultyBoxText: {
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#446BCF',
    paddingVertical: 15, // Reduced padding
    borderRadius: 25,
    width: '90%',
    alignItems: 'center',
    marginTop: 10, // Reduced margin
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default InitialSetupScreen;