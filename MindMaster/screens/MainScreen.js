// screens/MainScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; 
import { auth, db } from '../firebase';
import AppText from '../components/AppText';

// Icon and Character Image Assets
const chestIcon = require('../assets/images/icons/chest_icon.png'); 
const medalIcon = require('../assets/images/icons/medal_icon.png'); 
const heartImage = require('../assets/images/icons/heart_icon.png'); // **** NEW: Path to your heart image ****

const characterImageLookup = {
  'default_look': require('../assets/images/characters/overlays/default_look.png'),
  'male_knight_overlay': require('../assets/images/characters/overlays/male_knight_overlay.png'),
  'female_mage_overlay': require('../assets/images/characters/overlays/female_mage_overlay.png'),
  'male_archer_overlay': require('../assets/images/characters/overlays/male_archer_overlay.png'),
};

// HeartIcon component now uses an Image
const HeartIcon = () => <Image source={heartImage} style={styles.heartImage} />; 

const XP_PER_PLAYER_LEVEL = 1000; 
const DEFAULT_LIVES_ON_RESET = 4;

const getCurrentDateString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const MainScreen = () => {
  const navigation = useNavigation();
  const currentUser = auth.currentUser;
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [xpForCurrentLevel, setXpForCurrentLevel] = useState(0); 
  const [xpToNextLevel, setXpToNextLevel] = useState(XP_PER_PLAYER_LEVEL); 
  const [characterImageSource, setCharacterImageSource] = useState(characterImageLookup['default_look']);

  useFocusEffect(
    useCallback(() => {
      let isActive = true; 
      const fetchAndProcessUserData = async () => {
        if (!currentUser) { if (isActive) { navigation.replace('Auth'); setLoading(false); } return; }
        if(isActive) setLoading(true);
        const userRef = db.collection('users').doc(currentUser.uid);
        
        const unsubscribeSnapshot = userRef.onSnapshot(async (doc) => { 
            if (!isActive) { if (typeof unsubscribeSnapshot === 'function') unsubscribeSnapshot(); return; } 
            if (doc.exists) {
              let data = doc.data();
              const todayString = getCurrentDateString();
              const lastResetDate = data.lastLivesResetDate;
              let livesNeedUpdate = false;
              if (lastResetDate !== todayString || data.lives === undefined || data.lives < 0) {
                if ((data.lives !== DEFAULT_LIVES_ON_RESET && data.lives !== undefined) || lastResetDate !== todayString) {
                    livesNeedUpdate = true;
                }
              }
              if (livesNeedUpdate) {
                try { await userRef.update({ lives: DEFAULT_LIVES_ON_RESET, lastLivesResetDate: todayString }); } 
                catch (updateError) { console.error("MainScreen: Error resetting lives:", updateError); }
              } else { 
                if (isActive) { 
                    setUserData(data);
                    const currentXP = data.xp || 0;
                    const levelCalc = Math.floor(currentXP / XP_PER_PLAYER_LEVEL) + 1;
                    const xpIntoCurrentTier = currentXP % XP_PER_PLAYER_LEVEL; 
                    setPlayerLevel(levelCalc); setXpForCurrentLevel(xpIntoCurrentTier); setXpToNextLevel(XP_PER_PLAYER_LEVEL);
                    const overlayKey = data.characterLook?.overlay || 'default_look';
                    setCharacterImageSource(characterImageLookup[overlayKey] || characterImageLookup['default_look']);
                    setLoading(false);
                }
              }
              if (isActive && livesNeedUpdate && !loading) {} 
              else if (isActive && !livesNeedUpdate) setLoading(false);
            } else {
              if(isActive) { Alert.alert("Profile Error", "Profile missing.", [{ text: "Go to Setup", onPress: () => navigation.replace('InitialSetup') }]); setUserData(null); setLoading(false); }
            }
          }, err => { if(isActive) { console.error("MainScreen Snapshot Error:", err); Alert.alert("Error", "Profile load fail."); setUserData(null); setLoading(false); }});
          return unsubscribeSnapshot; 
      };
      const unsubscribePromise = fetchAndProcessUserData();
      return () => { isActive = false; unsubscribePromise.then(unsub => { if (typeof unsub === 'function') unsub(); }).catch(e => console.error("MainScreen Unsub Err:", e)); };
    }, [currentUser, navigation]) 
  );

  if (loading) { return <View style={[styles.screenContainer, styles.centered]}><ActivityIndicator size="large" color="#FFFFFF" /><Text style={styles.loadingText}>Loading...</Text></View>; }
  if (!userData && !loading) { return <View style={[styles.screenContainer, styles.centered]}><Text style={styles.errorText}>User data missing.</Text><TouchableOpacity style={styles.button} onPress={() => auth.signOut()}><Text style={styles.buttonText}>Sign Out</Text></TouchableOpacity></View>; }

  const displayName = userData?.nickname || 'Player';
  const lives = userData?.lives ?? DEFAULT_LIVES_ON_RESET; 
  const currentTotalXP = userData?.xp || 0; 
  const displayXP = currentTotalXP % xpToNextLevel;
  const displayMaxXP = xpToNextLevel;
  const xpProgressPercent = displayMaxXP > 0 ? (displayXP / displayMaxXP) * 100 : 0;

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topInfoBar}>
        <TouchableOpacity 
            style={styles.topLeftIconContainer} 
            onPress={()=> navigation.navigate('Settings', { initialTab: 'Lifeline' })} 
        >
            <Image source={chestIcon} style={styles.topIcon} />
        </TouchableOpacity>
        <View style={styles.userInfoContainer}>
            <Text style={styles.nicknameText}>{displayName}</Text>
            <View style={styles.xpBar}>
                <View style={[styles.xpBarProgress, {width: `${xpProgressPercent > 100 ? 100 : xpProgressPercent}%`}]} />
                <Text style={styles.xpText}>{displayXP}/{displayMaxXP} xp</Text>
            </View>
        </View>
        <TouchableOpacity 
            style={styles.topRightIconContainer} 
            onPress={()=> navigation.navigate('CorrectedAnswers')}
        >
            <Image source={medalIcon} style={styles.topIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.livesDisplayContainer}>
        <Text style={styles.livesLabelText}>Lives left to use:</Text>
        <View style={styles.heartsContainer}>
            {Array.from({ length: lives < 0 ? 0 : lives }).map((_, index) => <HeartIcon key={`life-main-${index}`} />)}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.characterProfileButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Image source={characterImageSource} style={styles.characterImage} resizeMode="contain" />
        <Text style={styles.characterButtonText}>You</Text>
      </TouchableOpacity>
      
      <View style={styles.actionButtonsGroup}>
        <TouchableOpacity style={styles.mainActionButton} onPress={() => navigation.navigate('ExplorationMap')}>
          <Text style={styles.mainActionButtonText}>Exploration Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mainActionButton} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.mainActionButtonText}>Help Available</Text> 
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { 
    flex: 1, 
    paddingTop: 50, 
    paddingHorizontal: 20, 
    backgroundColor: '#81A9FF', 
  },
  centered: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#FFFFFF', fontSize: 16 },
  errorText: { color: '#FFFFFF', fontSize: 16, textAlign: 'center', marginBottom: 10 },
  topInfoBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  topLeftIconContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 240, 152, 0.8)', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.7)' },
  topRightIconContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#D4AF37' },
  topIcon: { width: 24, height: 24 },
  userInfoContainer: { flex: 1, alignItems: 'center', marginHorizontal: 10 },
  nicknameText: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', fontFamily: 'Jockey One', marginBottom: 4 },
  xpBar: { height: 20, width: '100%', backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 10, justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  xpBarProgress: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 9 },
  xpText: { position: 'absolute', alignSelf: 'center', fontSize: 10, color: '#FFFFFF', fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: {width:1, height:1}, textShadowRadius: 1 },
  livesDisplayContainer: { alignItems: 'center', marginBottom: 20 },
  livesLabelText: { fontSize: 15, color: '#FFFFFF', fontWeight: 'bold', marginBottom: 6 },
  heartsContainer: { flexDirection: 'row' },
  heartImage: { // **** STYLE FOR THE HEART IMAGE ****
    width: 28, // Adjust size as needed to match your pixel art heart
    height: 26, // Adjust size
    marginHorizontal: 2,
  }, 
  characterProfileButton: { marginTop: 30, backgroundColor: '#446BCF', borderRadius: 12, paddingVertical: 15, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 60, minHeight: 260, elevation: 3, shadowColor: '#000', shadowOffset: {width:0, height:1}, shadowOpacity:0.15, shadowRadius:2, borderWidth: 1.5, borderColor: 'rgb(255, 255, 255)' },
  characterImage: { width: 200, height: 200, margin: 8 },
  characterButtonText: { fontSize: 24, color: '#FFFFFF', fontWeight: 'bold', fontFamily: 'Jockey One' },
  actionButtonsGroup: {},
  mainActionButton: { backgroundColor: '#446BCF', paddingVertical: 16, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 12, elevation: 2, borderWidth: 1, borderColor: 'rgb(255, 255, 255)' },
  mainActionButtonText: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', fontFamily: 'Jockey One' },
  button: { backgroundColor: '#446BCF', paddingVertical: 16, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2 },
  buttonText: { color: '#FFFFFF', fontSize: 17, fontWeight: 'bold' },
});

export default MainScreen;