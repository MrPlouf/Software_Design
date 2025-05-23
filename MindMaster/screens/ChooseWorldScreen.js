// screens/ChooseWorldScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth, db } from '../firebase';

const LevelItem = ({ levelNumber, unlocked, onPress, isCompleted }) => (
    <TouchableOpacity
        style={[styles.levelItem, !unlocked && styles.lockedLevelItem, isCompleted && styles.completedLevelItem]}
        onPress={unlocked ? onPress : () => Alert.alert("Locked", `Level ${levelNumber} is locked.`)}
        disabled={!unlocked}
    >
        <Text style={styles.levelText}>Level {levelNumber}</Text>
        {!unlocked && <Text style={styles.lockIcon}>🔒</Text>}
        {unlocked && isCompleted && <Text style={styles.checkIcon}>✔️</Text>}
    </TouchableOpacity>
);

const ChooseWorldScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { worldId, worldName, startLevel, totalLevelsInWorld } = route.params; // Get params passed from ExplorationMapScreen
  
  const currentUser = auth.currentUser;
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const userRef = db.collection('users').doc(currentUser.uid);
      const unsubscribe = userRef.onSnapshot(doc => {
        if (doc.exists) {
          setUserProgress(doc.data().progress || { highestLevelCompleted: 0, completedLevels: {} });
        } else {
          setUserProgress({ highestLevelCompleted: 0, completedLevels: {} });
        }
        setLoading(false);
      }, err => {
        console.error("Error fetching user progress for ChooseWorldScreen:", err);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      navigation.replace('Auth');
      setLoading(false);
    }
  }, [currentUser, navigation]);

  const handleLevelPress = (levelAbsoluteNumber) => {
    // Navigate to the GameScreen with world and level info
    navigation.navigate('Game', { worldId, worldName, level: levelAbsoluteNumber });
  };

  if (loading) {
    return <View style={[styles.container, {justifyContent: 'center'}]}><ActivityIndicator size="large" color="#FFFFFF" /></View>;
  }

  const levelsInThisWorld = Array.from({ length: totalLevelsInWorld }, (_, i) => startLevel + i);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'< Exploration Map'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Learn before exploring</Text>
      <Text style={styles.worldTitle}>{worldName}</Text>
      <ScrollView contentContainerStyle={styles.levelsContainer}>
        {levelsInThisWorld.map((levelAbs) => {
          // A level is unlocked if it's the first level of the world,
          // or if the previous level (absolute numbering) is completed.
          // The very first level (level 1) is always unlocked.
          const isUnlocked = levelAbs === 1 || (userProgress && userProgress.highestLevelCompleted >= levelAbs - 1);
          const isCompleted = userProgress && userProgress.completedLevels && userProgress.completedLevels[worldId] && userProgress.completedLevels[worldId].includes(levelAbs);
          
          return (
            <LevelItem
                key={levelAbs}
                levelNumber={levelAbs}
                unlocked={isUnlocked}
                isCompleted={isCompleted}
                onPress={() => handleLevelPress(levelAbs)}
            />
          );
        })}
      </ScrollView>
       <TouchableOpacity 
        style={styles.otherResourcesButton}
        onPress={() => Alert.alert("Info", "Game Wiki and Learning resources link here.")}
      >
        <Text style={styles.otherResourcesButtonText}>Game Wiki and Learning</Text>
      </TouchableOpacity>
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: 'Jockey One',
  },
  worldTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Jockey One',
  },
  levelsContainer: {
    paddingBottom: 20,
  },
  levelItem: {
    backgroundColor: '#446BCF',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  lockedLevelItem: {
    backgroundColor: '#788cb3',
  },
  completedLevelItem: {
    backgroundColor: '#3e8e41', // A green color for completed
    borderColor: '#FFD700',
    borderWidth: 1,
  },
  levelText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  lockIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  checkIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  otherResourcesButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  otherResourcesButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChooseWorldScreen;