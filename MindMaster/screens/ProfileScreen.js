// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image, ScrollView } from 'react-native'; // Added ScrollView
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { auth, db } from '../firebase';

// --- Image Mapping ---
const baseBodyImage = require('../assets/images/characters/base_body.png'); // Ensure this path is correct

const headImageSources = {
  'default_head': require('../assets/images/characters/heads/default_head.png'),
  'cat_ears': require('../assets/images/characters/heads/cat_ears.png'),
  'cool_hat': require('../assets/images/characters/heads/cool_hat.png'),
  //'frog_head': require('../assets/images/characters/heads/frog_head.png'),
};

const weaponImageSources = {
  'default_sword': require('../assets/images/characters/weapons/default_sword.png'),
  'laser_gun': require('../assets/images/characters/weapons/laser_gun.png'),
  'magic_staff': require('../assets/images/characters/weapons/magic_staff.png'),
  //'shield': require('../assets/images/characters/weapons/shield.png'),
};
// --- End Image Mapping ---


const ItemBox = ({ imageKey, type, selected, onPress }) => {
  let source;
  if (type === 'head' && headImageSources[imageKey]) {
    source = headImageSources[imageKey];
  } else if (type === 'weapon' && weaponImageSources[imageKey]) {
    source = weaponImageSources[imageKey];
  } else {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.itemBox, selected && styles.selectedItemBox]}>
            <Text style={{fontSize:10, color: selected ? '#fff' : '#333', textAlign: 'center'}}>{imageKey.replace(/_/g, ' ')}</Text>
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

  const headItemKeys = ['default_head', 'cat_ears', 'cool_hat', 'frog_head'];
  const weaponItemKeys = ['default_sword', 'laser_gun', 'magic_staff', 'shield'];

  const [selectedHeadKey, setSelectedHeadKey] = useState('default_head');
  const [selectedWeaponKey, setSelectedWeaponKey] = useState('default_sword');

  useEffect(() => {
    if (currentUser && isFocused) {
      setLoading(true);
      const userRef = db.collection('users').doc(currentUser.uid);
      const unsubscribe = userRef.onSnapshot(doc => {
        if (doc.exists) {
          const data = doc.data();
          setUserData(data);
          setSelectedHeadKey(data.characterLook?.head || 'default_head');
          setSelectedWeaponKey(data.characterLook?.weapon || 'default_sword');
        } else {
            // Handle case where user doc might not exist yet, though setup should create it.
            console.warn("ProfileScreen: User document not found for UID:", currentUser.uid);
        }
        setLoading(false);
      }, err => {
        console.error("Error fetching user data for ProfileScreen:", err);
        setLoading(false);
      });
      return () => unsubscribe();
    } else if (!currentUser) {
        navigation.replace('Auth'); // Should be caught by AuthLoading anyway
    }
  }, [currentUser, navigation, isFocused]);

  const handleSaveChanges = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      await db.collection('users').doc(currentUser.uid).update({
        characterLook: {
          head: selectedHeadKey,
          weapon: selectedWeaponKey,
        }
      });
      Alert.alert('Success', 'Look updated!');
    } catch (error) {
      Alert.alert('Error', 'Could not update look: ' + error.message);
    }
    setSaving(false);
  };

  if (loading) {
    return <View style={[styles.container, styles.centeredLoading]}><ActivityIndicator size="large" color="#FFFFFF" /></View>;
  }

  const currentHeadImage = headImageSources[selectedHeadKey] || headImageSources['default_head'];
  const currentWeaponImage = weaponImageSources[selectedWeaponKey] || weaponImageSources['default_sword'];

  return (
    <ScrollView style={styles.scrollView}>
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
                    {currentHeadImage && <Image source={currentHeadImage} style={styles.characterHeadOverlay} resizeMode="contain"/>}
                    {currentWeaponImage && <Image source={currentWeaponImage} style={styles.characterWeaponOverlay} resizeMode="contain"/>}
                </View>
                <Text style={styles.characterNameText}>{userData?.nickname || 'Player'}</Text>
            </View>

            <Text style={styles.sectionTitle}>Change your look</Text>
            
            <Text style={styles.subSectionTitle}>Head</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.itemsScrollContainer}>
                {headItemKeys.map(itemKey => (
                <ItemBox 
                    key={`head-${itemKey}`}
                    imageKey={itemKey} 
                    type="head"
                    selected={selectedHeadKey === itemKey} 
                    onPress={() => setSelectedHeadKey(itemKey)} 
                />
                ))}
            </ScrollView>

            <Text style={styles.subSectionTitle}>Weapon</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.itemsScrollContainer}>
                {weaponItemKeys.map(itemKey => (
                <ItemBox 
                    key={`weapon-${itemKey}`}
                    imageKey={itemKey}
                    type="weapon"
                    selected={selectedWeaponKey === itemKey} 
                    onPress={() => setSelectedWeaponKey(itemKey)} 
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
  container: {
    flexGrow: 1, // Changed from flex:1 for ScrollView content
    paddingHorizontal: 20,
    paddingBottom: 30, // Add padding at the bottom
    // backgroundColor: '#81A9FF', // Set on scrollView
  },
  centeredLoading: { // For the main loading indicator
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#81A9FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, 
    marginTop: 50, // For status bar space
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
  characterAssemblyArea: { // This View will contain all character parts
    width: 180, // Adjust width to fit your sprites well
    height: 220, // Adjust height
    // backgroundColor: 'rgba(0,0,0,0.1)', // Optional: for debugging layout
    position: 'relative', // Crucial for absolute positioning of children
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterBaseBody: {
    width: '100%', // Base body might fill the area
    height: '100%',
    position: 'absolute', // All parts absolute to stack
  },
  characterHeadOverlay: {
    width: '70%', // Example: Head might be 70% of the container width
    height: '50%', // Example: And 50% of height
    position: 'absolute',
    top: '5%', // Fine-tune this percentage or use absolute pixels
    // left: '15%', // Fine-tune: (100 - 70) / 2 for centering head
    alignSelf: 'center', // Another way to center if width is less than parent
    zIndex: 2, // Ensure head is above body
  },
  characterWeaponOverlay: {
    width: '60%',
    height: '60%',
    position: 'absolute',
    // Example positioning: adjust based on your sprites
    bottom: '10%', 
    right: '0%', // Or left, depending on how character holds it
    zIndex: 3, // Weapon might be above head or body
  },
  characterNameText: {
      // position: 'absolute', // Not needed if characterAssemblyArea handles centering
      // bottom: -25, 
      marginTop: 5, // Space between character box and name
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
  subSectionTitle: {
    fontSize: 16,
    color: '#F0F0F0',
    marginBottom: 10,
    marginLeft: 5, // Align with items container potentially
  },
  itemsScrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5, // Add padding if items touch edges
    marginBottom: 20,
  },
  itemBox: {
    width: 75, 
    height: 75,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10, // Slightly more rounded
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)', // Lighter border
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6, 
    overflow: 'hidden', // Ensure image stays within rounded corners
  },
  selectedItemBox: {
    borderColor: '#FFD700', 
    backgroundColor: '#446BCF',
    borderWidth: 2.5, // More prominent selection
  },
  itemImage: {
      width: '85%', 
      height: '85%',
  },
  actionButton: {
    paddingVertical: 15, 
    borderRadius: 12, // Consistent rounding
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
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