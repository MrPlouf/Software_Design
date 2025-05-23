// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image, ScrollView } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { auth, db } from '../firebase';

// --- Image Mapping ---
// Path to your base body sprite - ENSURE THIS FILE EXISTS AND PATH IS CORRECT
const baseBodyImage = require('../assets/images/characters/base_body.png'); 

// Paths to your selectable OVERLAY character looks/classes
// These images will be layered ON TOP of the baseBodyImage.
// Ensure they have transparent backgrounds where appropriate.
// ENSURE THESE FILES EXIST AND PATHS ARE CORRECT
const characterOverlaySources = {
  'default_look': require('../assets/images/characters/overlays/default_look.png'), 
  'male_knight_overlay': require('../assets/images/characters/overlays/male_knight_overlay.png'),
  'female_mage_overlay': require('../assets/images/characters/overlays/female_mage_overlay.png'),
  'male_archer_overlay': require('../assets/images/characters/overlays/male_archer_overlay.png'),
  // Add more overlay options as needed, e.g.:
  // 'female_warrior_overlay': require('../assets/images/characters/overlays/female_warrior_overlay.png'),
};
// --- End Image Mapping ---


const LookSelectionBox = ({ lookKey, selected, onPress }) => {
  const source = characterOverlaySources[lookKey]; 

  if (!source) { 
    return (
      <TouchableOpacity onPress={onPress} style={[styles.itemBox, selected && styles.selectedItemBox]}>
        <Text style={{fontSize:10, color: selected ? '#fff' : '#333', textAlign: 'center'}}>
          {lookKey.replace(/_/g, ' ')}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={[styles.itemBox, selected && styles.selectedItemBox]}>
      <Image source={source} style={styles.itemImage} resizeMode="contain" />
    </TouchableOpacity>
  );
};


const ProfileScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const currentUser = auth.currentUser;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Keys for the selectable overlay looks, matching keys in characterOverlaySources
  // Make sure these keys exactly match the keys in your characterOverlaySources object above
  const characterLookKeys = ['default_look', 'male_knight_overlay', 'female_mage_overlay', 'male_archer_overlay']; 

  const [selectedLookKey, setSelectedLookKey] = useState('default_look'); 

  useEffect(() => {
    if (currentUser && isFocused) {
      setLoading(true);
      const userRef = db.collection('users').doc(currentUser.uid);
      const unsubscribe = userRef.onSnapshot(doc => {
        if (doc.exists) {
          const data = doc.data();
          setUserData(data);
          setSelectedLookKey(data.characterLook?.overlay || 'default_look');
        } else {
            console.warn("ProfileScreen: User document not found for UID:", currentUser.uid);
            // If doc doesn't exist, user might need to go through InitialSetup again
            // or InitialSetup needs to create it reliably.
        }
        setLoading(false);
      }, err => {
        console.error("Error fetching user data for ProfileScreen:", err);
        Alert.alert("Error", "Could not load profile data.");
        setLoading(false);
      });
      return () => unsubscribe();
    } else if (!currentUser) {
        // This should ideally be caught by AuthLoadingScreen
        console.warn("ProfileScreen: No current user, redirecting to Auth.");
        navigation.replace('Auth');
    }
  }, [currentUser, navigation, isFocused]);

  const handleSaveChanges = async () => {
    if (!currentUser) {
        Alert.alert("Error", "You are not logged in.");
        return;
    }
    setSaving(true);
    try {
      await db.collection('users').doc(currentUser.uid).set({ // Use set with merge to create/update
        characterLook: {
          overlay: selectedLookKey,
        }
      }, { merge: true }); 

      Alert.alert('Success', 'Character look updated!');
    } catch (error) {
      console.error("Error saving character look: ", error);
      Alert.alert('Error', 'Could not update look: ' + error.message);
    }
    setSaving(false);
  };

  if (loading && !userData) { // Show loading only if data hasn't been fetched at all yet
    return <View style={[styles.container, styles.centeredLoading]}><ActivityIndicator size="large" color="#FFFFFF" /></View>;
  }

  const currentOverlayImage = characterOverlaySources[selectedLookKey] || characterOverlaySources['default_look'];

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>{'< Back'}</Text>
                </TouchableOpacity>
                <Text style={styles.title}>You</Text>
                <View style={{width: 40}} /> 
            </View>

            <View style={styles.characterDisplay}>
                <View style={styles.characterAssemblyArea}>
                    <Image source={baseBodyImage} style={styles.characterBaseBody} resizeMode="contain"/>
                    {currentOverlayImage && <Image source={currentOverlayImage} style={styles.characterOverlay} resizeMode="contain"/>}
                </View>
                <Text style={styles.characterNameText}>{userData?.nickname || 'Player'}</Text>
            </View>

            <Text style={styles.sectionTitle}>Change Character Look</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.itemsScrollContainer}>
                {characterLookKeys.map(itemKey => (
                  <LookSelectionBox 
                    key={`look-${itemKey}`}
                    lookKey={itemKey} 
                    selected={selectedLookKey === itemKey} 
                    onPress={() => setSelectedLookKey(itemKey)} 
                  />
                ))}
            </ScrollView>

            <TouchableOpacity 
                style={[styles.actionButton, styles.saveButton]} 
                onPress={handleSaveChanges}
                disabled={saving}
            >
                <Text style={styles.actionButtonText}>{saving ? <ActivityIndicator color="#fff" size="small"/> : 'Save Look'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.actionButton, styles.wikiButton]}
                onPress={() => Alert.alert("Info", "Game Wiki and Learning coming soon!")}
            >
                <Text style={styles.actionButtonText}>Game Wiki and Learning</Text>
            </TouchableOpacity>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#81A9FF',
  },
  scrollViewContent: { // Added for ScrollView content
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30, 
  },
  centeredLoading: {
    flex:1, // Takes full screen
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#81A9FF', // Match screen bg
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, 
    marginTop: 50, // Space for status bar
  },
  backButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Jockey One',
  },
  characterDisplay: {
    alignItems: 'center',
    marginBottom: 25, 
  },
  characterAssemblyArea: { 
    width: 180, 
    height: 220, 
    position: 'relative', 
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.1)', // For debugging layout of assembly area
  },
  characterBaseBody: { 
    width: '100%', 
    height: '100%',
    position: 'absolute', 
  },
  characterOverlay: { 
    width: '100%', 
    height: '100%',
    position: 'absolute', 
    zIndex: 1, 
  },
  characterNameText: {
      marginTop: 10, 
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 18,
      textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center'
  },
  itemsScrollContainer: { // For the horizontal ScrollView of looks
    paddingVertical: 10,
    paddingHorizontal: 5, // If boxes touch edge
    marginBottom: 25,
    alignItems: 'center', // Center items if they don't fill width
  },
  itemBox: { 
    width: 80, 
    height: 100, 
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6, 
    overflow: 'hidden',
  },
  selectedItemBox: {
    borderColor: '#FFD700', 
    backgroundColor: '#446BCF',
    borderWidth: 2.5,
  },
  itemImage: { 
      width: '90%', 
      height: '90%',
  },
  actionButton: {
    paddingVertical: 15, 
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    width: '100%', // Make buttons full width of their container
    alignSelf: 'center', // Center button if container is wider
    elevation: 2,
  },
  saveButton: {
    backgroundColor: '#4CAF50', 
  },
  wikiButton: {
    backgroundColor: '#446BCF', 
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;