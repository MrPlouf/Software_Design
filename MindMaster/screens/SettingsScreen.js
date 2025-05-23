import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebase';
// You might want to use a Picker or custom component for difficulty/language
// For simplicity, I'm using Text and TouchableOpacity for difficulty

const difficulties = ['Easy', 'Medium', 'Hard', 'Expert'];

const SettingsScreen = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const userRef = db.collection('users').doc(currentUser.uid);
      const unsubscribe = userRef.onSnapshot(doc => {
        if (doc.exists) {
          const userData = doc.data();
          setNickname(userData.nickname || '');
          setEmail(userData.email || '');
          setDifficulty(userData.difficulty || 'medium');
          setLanguage(userData.language || 'English');
        }
        setLoading(false);
      }, err => {
        console.error("Error fetching user settings:", err);
        Alert.alert("Error", "Could not load settings.");
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      navigation.replace('Auth'); // Should not happen
    }
  }, [currentUser, navigation]);

  const handleSaveChanges = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      await db.collection('users').doc(currentUser.uid).update({
        nickname, // In a real app, you'd have an input for this
        difficulty: difficulty.toLowerCase(),
        language, // And for this
      });
      Alert.alert('Success', 'Settings saved!');
    } catch (error) {
      Alert.alert('Error', 'Could not save settings: ' + error.message);
    }
    setSaving(false);
  };
  
  const handleSignOut = () => {
    auth.signOut().catch(error => Alert.alert('Sign Out Error', error.message));
    // AuthLoadingScreen will handle navigation to Auth stack
  };


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Settings</Text>
      
      {/* Display Nickname (Input field would be needed to change it) */}
      <View style={styles.settingItem}>
        <Text style={styles.label}>Nickname:</Text>
        <Text style={styles.value}>{nickname || 'Not set'}</Text>
      </View>

      {/* Display Email (Cannot be changed here directly via Firebase Auth SDK easily) */}
      <View style={styles.settingItem}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{email}</Text>
      </View>

      {/* Difficulty Setting */}
      <View style={styles.settingItem}>
        <Text style={styles.label}>Difficulty Level:</Text>
        <View style={styles.optionsContainer}>
          {difficulties.map(d => (
            <TouchableOpacity 
              key={d}
              style={[styles.optionButton, difficulty.toLowerCase() === d.toLowerCase() && styles.selectedOption]}
              onPress={() => setDifficulty(d)}
            >
              <Text style={[styles.optionText, difficulty.toLowerCase() === d.toLowerCase() && styles.selectedOptionText]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Language Setting (Placeholder) */}
       <View style={styles.settingItem}>
        <Text style={styles.label}>Language:</Text>
         <Text style={styles.value}>{language}</Text>
        {/* Implement language picker here */}
      </View>

      <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSaveChanges} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.signOutButton]} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#81A9FF', // Consistent background
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Jockey One',
  },
  settingItem: {
    marginBottom: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    backgroundColor: '#A8C0FF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  selectedOption: {
    backgroundColor: '#446BCF',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  selectedOptionText:{
    fontWeight: 'bold',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#4CAF50', // Green
  },
  signOutButton: {
    backgroundColor: '#f44336', // Red
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;