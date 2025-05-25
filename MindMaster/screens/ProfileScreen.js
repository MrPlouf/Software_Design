// screens/ProfileScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image, ScrollView } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { auth, db } from '../firebase';
// Assuming AppText is created for consistent font:
// import AppText from '../components/AppText'; 
// If not, replace AppText with Text and ensure fontFamily is in styles

// --- Image Mapping for Character Looks ---
// IMPORTANT: 
// 1. Create these folders: assets/images/characters/long_hair/ and assets/images/characters/short_hair/
// 2. Place your FULL character sprite images (not just heads/weapons) in these folders.
// 3. Rename your image files to match the keys used here (e.g., 'style_1.png', 'style_2.png').

const longHairImageSources = {
  'lh_style_1': require('../assets/images/characters/weapons/magic_staff.png'), 
  'lh_style_2': require('../assets/images/characters/weapons/male_knight_overlay.png'),
  'lh_style_3': require('../assets/images/characters/weapons/male_archer_overlay.png'),
};

const shortHairImageSources = {
  'sh_style_1': require('../assets/images/characters/heads/frog_head.png'), 
  'sh_style_2': require('../assets/images/characters/heads/cat_ears.png'),
  'sh_style_3': require('../assets/images/characters/heads/female_mage_overlay.png'),
  'lh_style_4': require('../assets/images/characters/heads/default_look.png'),

};

// Default look if nothing is selected or if selected key is invalid
const defaultCharacterLookSource = require('../assets/images/characters/overlays/default_look.png');

// Combine all for easier lookup for the main display image
const allCharacterImageSources = {
    ...longHairImageSources,
    ...shortHairImageSources,
    'default_look': defaultCharacterLookSource,
};
// --- End Image Mapping ---


const LookSelectionBox = ({ imageKey, source, selected, onPress, category }) => {
  if (!source) { 
    return (
      <TouchableOpacity onPress={onPress} style={[styles.itemBoxBase, selected && styles.selectedItemBox]}>
        <Text style={styles.itemTextFallback}>{imageKey.replace(/_/g, ' ')}</Text>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity onPress={onPress} style={[styles.itemBoxBase, selected && styles.selectedItemBox]}>
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

  const longHairItemKeys = Object.keys(longHairImageSources);
  const shortHairItemKeys = Object.keys(shortHairImageSources);

  // This single state now holds the key of the chosen character sprite
  const [selectedLookKey, setSelectedLookKey] = useState('default_look'); 

  useEffect(() => {
    if (currentUser && isFocused) {
      setLoading(true);
      const userRef = db.collection('users').doc(currentUser.uid);
      const unsubscribe = userRef.onSnapshot(doc => {
        if (doc.exists) {
          const data = doc.data();
          setUserData(data);
          // Firestore should store something like: characterLook: { selectedSpriteKey: 'lh_style_1' }
          setSelectedLookKey(data.characterLook?.selectedSpriteKey || 'default_look'); 
        } else {
            console.warn("ProfileScreen: User document not found for UID:", currentUser.uid);
        }
        setLoading(false);
      }, err => {
        console.error("ProfileScreen: Error fetching user data:", err);
        setLoading(false);
      });
      return () => unsubscribe();
    } else if (!currentUser && isFocused) { // Added isFocused here for safety
        navigation.replace('Auth');
    }
  }, [currentUser, navigation, isFocused]);

  const handleSaveChanges = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      await db.collection('users').doc(currentUser.uid).set({ // Use .set with merge
        characterLook: {
          selectedSpriteKey: selectedLookKey, // Store the single selected key
        }
      }, { merge: true }); 

      Alert.alert('Success', 'Character look updated!');
    } catch (error) {
      Alert.alert('Error', 'Could not update look: ' + error.message);
    }
    setSaving(false);
  };

  if (loading && !userData) { // Show loader if still fetching initial data
    return <View style={[styles.screenContainer, styles.centeredLoading]}><ActivityIndicator size="large" color="#FFFFFF" /></View>;
  }

  const currentCharacterImageForDisplay = allCharacterImageSources[selectedLookKey] || defaultCharacterLookSource;

  return (
    <ScrollView   showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.screenContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>{'< Back'}</Text>
                </TouchableOpacity>
                <Text style={styles.title}>You</Text>
                <View style={{width: 40}} />{/* Spacer */}
            </View>

            <View style={styles.characterDisplay}>
                <View style={styles.characterFullDisplayArea}>
                    {currentCharacterImageForDisplay && 
                        <Image source={currentCharacterImageForDisplay} style={styles.mainCharacterImage} resizeMode="contain"/>
                    }
                </View>
                <Text style={styles.characterNameText}>{userData?.nickname || 'Player'}</Text>
            </View>

            <Text style={styles.sectionTitle}>Change your Character</Text>
            
            <Text style={styles.subSectionTitle}>Long Haired Styles</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.itemsScrollContainer}>
                {longHairItemKeys.map(itemKey => (
                  <LookSelectionBox 
                    key={`long-${itemKey}`}
                    imageKey={itemKey} 
                    source={longHairImageSources[itemKey]}
                    selected={selectedLookKey === itemKey} 
                    onPress={() => setSelectedLookKey(itemKey)} 
                    category="long_hair"
                  />
                ))}
            </ScrollView>

            <Text style={styles.subSectionTitle}>Short Haired Styles</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.itemsScrollContainer}>
                {shortHairItemKeys.map(itemKey => (
                  <LookSelectionBox 
                    key={`short-${itemKey}`}
                    imageKey={itemKey}
                    source={shortHairImageSources[itemKey]}
                    selected={selectedLookKey === itemKey} 
                    onPress={() => setSelectedLookKey(itemKey)} 
                    category="short_hair"
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
  scrollView: { flex: 1, backgroundColor: '#81A9FF' },
  screenContainer: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 30 },
  centeredLoading: { flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#81A9FF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 50 },
  backButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', fontFamily: 'JockeyOne-Regular' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', fontFamily: 'JockeyOne-Regular' },
  characterDisplay: { alignItems: 'center', marginBottom: 25 },
  characterFullDisplayArea: { width: 180, height: 220, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#446BCF' },
  mainCharacterImage: { width: '95%', height: '95%' },
  characterNameText: { marginTop: 10, color: '#FFFFFF', fontWeight: 'bold', fontSize: 18, textAlign: 'center', fontFamily: 'JockeyOne-Regular' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 15, textAlign: 'center', fontFamily: 'JockeyOne-Regular' },
  subSectionTitle: { fontSize: 17, fontWeight: '600', color: '#E0E0FF', marginBottom: 10, marginLeft: 5, fontFamily: 'JockeyOne-Regular' },
  itemsScrollContainer: { paddingVertical: 10, paddingHorizontal: 5, marginBottom: 20 },
  itemBoxBase: { width: 90, height: 110, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center', marginHorizontal: 6, overflow: 'hidden' },
  selectedItemBox: { borderColor: '#FFD700', backgroundColor: '#446BCF', borderWidth: 2.5 },
  itemImage: { width: '90%', height: '90%' },
  itemTextFallback: { fontSize:10, color: '#333', textAlign: 'center', padding:5, fontFamily: 'JockeyOne-Regular'},
  actionButton: { paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 10, width: '100%', elevation: 2 },
  saveButton: { backgroundColor: '#4CAF50' },
  wikiButton: { backgroundColor: '#446BCF' },
  actionButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', fontFamily: 'JockeyOne-Regular' },
});

export default ProfileScreen;