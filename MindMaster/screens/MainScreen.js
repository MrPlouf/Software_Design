// screens/MainScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native'; // Added Alert
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { auth, db } from '../firebase';

// Placeholder for heart icon, replace with actual icon component or image
const HeartIcon = () => <Text style={{fontSize: 20, color: 'red', marginRight: 2}}>♥</Text>; 

const MainScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const currentUser = auth.currentUser;
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && isFocused) {
      setLoading(true);
      const userRef = db.collection('users').doc(currentUser.uid);
      const unsubscribe = userRef.onSnapshot(doc => {
        if (doc.exists) {
          setUserData(doc.data());
        } else {
          console.warn("MainScreen: User document not found for UID:", currentUser.uid);
        }
        setLoading(false);
      }, err => {
        console.error("Error fetching user data for MainScreen:", err);
        Alert.alert("Error", "Could not load user data.");
        setLoading(false);
      });
      return () => unsubscribe();
    } else if (!currentUser) {
        navigation.replace('Auth');
    }
  }, [currentUser, navigation, isFocused]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  const displayName = userData?.nickname || currentUser?.email || 'Player';
  const lives = userData?.lives ?? 3; 

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.nickname}>{displayName}</Text>
          <View style={styles.livesContainer}>
            <Text style={styles.livesText}>Lives left to use: </Text>
            {Array.from({ length: lives }).map((_, index) => (
              <HeartIcon key={index} />
            ))}
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.profileIconPlaceholder}>
              {/* Add small profile icon/image here */}
              <Text style={{color: 'white', fontSize: 10}}>P</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.characterSection}>
        <View style={styles.characterImagePlaceholder}>
            <Text style={styles.placeholderText}>YOU</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('ExplorationMap')} // Navigate to Exploration Map
      >
        <Text style={styles.buttonText}>Exploration Map</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Help')} // Navigate to Help Hub Screen
      >
        <Text style={styles.buttonText}>Help Available</Text>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  nickname: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Jockey One',
  },
  livesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  livesText: {
    fontSize: 14,
    color: '#F0F0F0',
  },
  profileIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#446BCF', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  characterImagePlaceholder: {
    width: 150,
    height: 180, 
    backgroundColor: '#A8C0FF', 
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#446BCF'
  },
  placeholderText: {
      color: '#FFF',
      fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#446BCF',
    paddingVertical: 18,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MainScreen;