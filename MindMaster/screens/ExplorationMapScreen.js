// screens/ExplorationMapScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebase';

// Placeholder for world/level items
const WorldNode = ({ worldId, worldName, level, unlocked, onPress }) => {
    return (
        <TouchableOpacity 
            style={[styles.worldNode, !unlocked && styles.lockedWorldNode]} 
            onPress={unlocked ? onPress : () => Alert.alert("Locked", `${worldName} is locked.`)}
            disabled={!unlocked}
        >
            {/* Replace with actual world icon/image */}
            <View style={styles.worldIconPlaceholder}>
                <Text style={styles.worldLevelText}>{level}</Text>
            </View>
            <Text style={styles.worldNameText}>{worldName}</Text>
            {!unlocked && <Text style={styles.lockIcon}>🔒</Text>}
        </TouchableOpacity>
    );
};


const ExplorationMapScreen = () => {
  const navigation = useNavigation();
  const currentUser = auth.currentUser;
  const [userProgress, setUserProgress] = useState(null); // To store which worlds/levels are unlocked
  const [loading, setLoading] = useState(true);

  // Define worlds - this could also come from Firestore in a more complex setup
  const worlds = [
    { id: 'world1', name: 'World 1', startLevel: 1, icon: '🏝️', levels: 5 }, // Example levels
    { id: 'world2', name: 'World 2', startLevel: 6, icon: '🌋', levels: 5 },
    { id: 'world3', name: 'World 3', startLevel: 11, icon: '❄️', levels: 5 },
    // Add more worlds as needed
  ];

  useEffect(() => {
    if (currentUser) {
      const userRef = db.collection('users').doc(currentUser.uid);
      const unsubscribe = userRef.onSnapshot(doc => {
        if (doc.exists) {
          setUserProgress(doc.data().progress || { highestLevelCompleted: 0 }); // Default if no progress
        } else {
          setUserProgress({ highestLevelCompleted: 0 });
        }
        setLoading(false);
      }, err => {
        console.error("Error fetching user progress:", err);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      navigation.replace('Auth');
      setLoading(false);
    }
  }, [currentUser, navigation]);

  const handleWorldPress = (world) => {
    // Navigate to a screen where user can choose a level within this world
    navigation.navigate('ChooseWorld', { worldId: world.id, worldName: world.name, startLevel: world.startLevel, totalLevelsInWorld: world.levels });
  };

  if (loading) {
    return <View style={[styles.container, {justifyContent: 'center'}]}><ActivityIndicator size="large" color="#FFFFFF" /></View>;
  }

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>{'< Back'}</Text>
        </TouchableOpacity>
      <Text style={styles.title}>Exploration Map</Text>
      <ScrollView contentContainerStyle={styles.mapContainer}>
        {/* This is a simplified layout. You'd likely use absolute positioning or a more complex UI for a real map */}
        {worlds.map((world, index) => {
            // Determine if world is unlocked based on user progress
            // Example: World 1 is always unlocked. World 2 unlocks if level 5 (from world 1) is complete.
            // This logic needs to be more robust based on your game's progression system.
            // For now, let's assume the first world is unlocked, and others require previous world completion.
            const isUnlocked = index === 0 || (userProgress && userProgress.highestLevelCompleted >= world.startLevel -1 );
            
            // This is a simple linear representation. The image shows a branching path.
            // You'll need a more sophisticated rendering for that.
            return (
                 <WorldNode
                    key={world.id}
                    worldId={world.id}
                    worldName={world.name}
                    level={world.startLevel} // Or display world number
                    unlocked={isUnlocked}
                    onPress={() => handleWorldPress(world)}
                />
            );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#81A9FF',
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Jockey One',
  },
  mapContainer: {
    alignItems: 'center', // For a simple vertical list of worlds
    // For a complex map, you might remove this and use absolute positioning for WorldNode
  },
  worldNode: {
    backgroundColor: '#446BCF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
    flexDirection: 'row', // For icon and text side-by-side
    elevation: 3,
  },
  lockedWorldNode: {
    backgroundColor: '#788cb3', // Dimmer color for locked worlds
  },
  worldIconPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#A8C0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  worldLevelText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#446BCF'
  },
  worldNameText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  lockIcon: {
    fontSize: 24,
    marginLeft: 'auto', // Push lock icon to the right
    color: '#FFFFFF',
  },
});

export default ExplorationMapScreen;