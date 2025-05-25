// screens/ChooseWorldScreen.js
import AppText from '../components/AppText';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { auth, db } from '../firebase';
import { LinearGradient } from 'expo-linear-gradient'; 

const PathConnectorView = ({ style }) => <View style={[styles.pathConnector, style]} />;

const LevelNode = ({ levelDisplayNumber, unlocked, onPress, isCompleted, dynamicStyle }) => (
    <TouchableOpacity
        style={[styles.levelNodeBase, dynamicStyle, unlocked ? styles.levelNodeUnlocked : styles.levelNodeLocked, isCompleted && styles.levelNodeCompleted]}
        onPress={unlocked ? onPress : () => Alert.alert("Locked", `Level ${levelDisplayNumber} is locked.`)}
        disabled={!unlocked && !isCompleted}
    >
        <Text style={styles.levelNodeText}>{levelDisplayNumber}</Text>
        {(!unlocked && !isCompleted) && <View style={styles.levelLockOverlay}><Text style={styles.levelLockIcon}>🔒</Text></View>}
        {isCompleted}
    </TouchableOpacity>
);

const calculateLevelNodePositions = (numLevels, canvasW, initialCanvasH) => { /* ... (same as before) ... */ 
    if (!canvasW || !initialCanvasH || numLevels === 0) return { layouts: {}, calculatedCanvasHeight: initialCanvasH };
    const layouts = {}; const nodeSize = 70; 
    const topPadding = 50; const bottomPadding = 50; const horizontalPadding = 30; 
    const verticalStep = nodeSize + 60; 
    const availableWidth = canvasW - (2 * horizontalPadding) - nodeSize;
    let calculatedCanvasHeight = topPadding; 
    for (let i = 0; i < numLevels; i++) {
        let xRatio; const posInPattern = i % 4;
        if (posInPattern === 0) xRatio = 0.15; else if (posInPattern === 1) xRatio = 0.5; else if (posInPattern === 2) xRatio = 0.85; else xRatio = 0.5;                           
        const left = horizontalPadding + (xRatio * availableWidth);
        const top = topPadding + (i * verticalStep); 
        layouts[`level_${i+1}`] = { top: top, left: Math.max(horizontalPadding, Math.min(left, canvasW - nodeSize - horizontalPadding)), width: nodeSize, height: nodeSize, zIndex: 10 + i, calculated: true };
    }
    if (numLevels > 0) { const lastNodeKey = `level_${numLevels}`; if (layouts[lastNodeKey]) { calculatedCanvasHeight = layouts[lastNodeKey].top + nodeSize + bottomPadding; } else { calculatedCanvasHeight = topPadding + (numLevels * verticalStep) - (verticalStep - nodeSize) + bottomPadding; }} else { calculatedCanvasHeight = initialCanvasH; }
    return { layouts, calculatedCanvasHeight: Math.max(initialCanvasH, calculatedCanvasHeight) };
};

const ChooseWorldScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { worldId: themeName, worldName, totalLevelsInWorld = 10 } = route.params; 
  
  const currentUser = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const [levelNodeLayouts, setLevelNodeLayouts] = useState({});
  const [levelPathStyles, setLevelPathStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canvasLayout, setCanvasLayout] = useState({width:0, height:0, contentHeight:0});

  useFocusEffect( /* ... (same as before) ... */ 
    useCallback(() => {
      let isActive = true;
      const fetchUserData = async () => { if (!currentUser) { if(isActive) { navigation.replace('Auth'); setLoading(false); } return; } if(isActive) setLoading(true); const userRef = db.collection('users').doc(currentUser.uid); const unsubscribe = userRef.onSnapshot(doc => { if (!isActive) { if(typeof unsubscribe === 'function') unsubscribe(); return; } if (doc.exists) setUserData(doc.data()); else setUserData({ currentLevelByTheme: {} }); if(isActive) setLoading(false); }, err => { if(isActive) { console.error("ChooseWorld: User data error:", err); setLoading(false); }}); return unsubscribe; };
      const unsubProm = fetchUserData();
      return () => { isActive = false; unsubProm.then(unsub => { if (typeof unsub === 'function') unsub(); }).catch(e => console.error("ChooseWorld Unsub Err:", e));};
    }, [currentUser, navigation])
  );

  useEffect(() => { /* ... (same as before) ... */ 
    if (canvasLayout.width > 0 && canvasLayout.height > 0 && totalLevelsInWorld > 0) { const { layouts, calculatedCanvasHeight } = calculateLevelNodePositions(totalLevelsInWorld, canvasLayout.width, canvasLayout.height); setLevelNodeLayouts(layouts); setCanvasLayout(prev => ({...prev, contentHeight: calculatedCanvasHeight })); }
  }, [canvasLayout.width, canvasLayout.height, totalLevelsInWorld]);

  useEffect(() => { /* ... (same as before) ... */ 
    const numLevels = totalLevelsInWorld; const allNodesHaveLayout = Array.from({length: numLevels}, (_,i) => levelNodeLayouts[`level_${i+1}`]?.calculated).every(Boolean);
    if (allNodesHaveLayout && numLevels > 1) {
      const paths = [];
      for (let i = 0; i < numLevels - 1; i++) {
        const startNodeLayout = levelNodeLayouts[`level_${i+1}`]; const endNodeLayout = levelNodeLayouts[`level_${i+2}`];
        if (startNodeLayout && endNodeLayout) {
          const startX = startNodeLayout.left + startNodeLayout.width / 2; const startY = startNodeLayout.top + startNodeLayout.height / 2; const endX = endNodeLayout.left + endNodeLayout.width / 2; const endY = endNodeLayout.top + endNodeLayout.height / 2;
          const deltaX = endX - startX; const deltaY = endY - startY; const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY); const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
          paths.push({ width: length, height: 8, left: (startX + endX - length) / 2 , top: (startY + endY) / 2 - (8/2), transform: [{rotate: `${angle}deg`}], zIndex: 1 });
        }
      }
      setLevelPathStyles(paths);
    } else { setLevelPathStyles([]); }
  }, [levelNodeLayouts, totalLevelsInWorld]);

  if (loading && !userData) return <View style={[styles.screenContainerForLoading, styles.centered]}><ActivityIndicator size="large" color="#FFFFFF" /></View>;

  const highestLevelCompletedForThisTheme = userData?.currentLevelByTheme?.[themeName] || 0;
  const levelsToDisplay = Array.from({ length: totalLevelsInWorld }, (_, i) => i + 1);

  return (
    <LinearGradient colors={['#81A9FF', '#81A9FF', '#6A8AB0']} style={styles.screenGradientBackground}>
      <View style={styles.screenContentContainer}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <AppText style={styles.backButtonText}>{'< Map'}</AppText>
            </TouchableOpacity>
            <AppText style={styles.title} numberOfLines={1} ellipsizeMode="tail">{worldName}</AppText>
            <View style={{width:50}} />
        </View>
        {/* SubTitle is correctly wrapped */}
        
        <View 
          style={styles.levelPathScrollViewContainer}
          onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              if (width > 0 && height > 0 && (!canvasLayout.width || !canvasLayout.height)) { 
                setCanvasLayout({ width, height, contentHeight: height }); 
              }
          }}
        >
          {canvasLayout.width > 0 && canvasLayout.height > 0 && ( 
              <ScrollView 
                contentContainerStyle={{ height: canvasLayout.contentHeight }} 
                showsVerticalScrollIndicator={true}
              >
                <View style={styles.levelCanvas}> 
                    {levelPathStyles.map((pathStyle, index) => (
                        <PathConnectorView key={`path-lvl-${index}`} style={pathStyle} />
                    ))}
                    {levelsToDisplay.map((levelNum) => {
                        const isUnlocked = levelNum === 1 || highestLevelCompletedForThisTheme >= (levelNum - 1);
                        const isCompleted = highestLevelCompletedForThisTheme >= levelNum;
                        return ( 
                            <LevelNode 
                                key={levelNum} 
                                levelDisplayNumber={levelNum} 
                                unlocked={isUnlocked || isCompleted} 
                                isCompleted={isCompleted} 
                                dynamicStyle={levelNodeLayouts[`level_${levelNum}`] || {opacity:0}}
                                onPress={() => navigation.navigate('Game', { worldId: themeName, worldName: worldName, level: levelNum })} 
                            /> 
                        );
                    })}
                </View>
              </ScrollView>
          )}
        </View>
        <TouchableOpacity style={styles.otherResourcesButton} onPress={() => Alert.alert("Info", "Game Wiki/Learning (WIP)")} >
          <Text style={styles.otherResourcesButtonText}>Game Wiki and Learning</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  screenGradientBackground: { flex: 1 },
  screenContentContainer: { flex: 1, paddingTop: 30, paddingHorizontal: 15, /* No bg color, gradient handles it */ },
  screenContainerForLoading: { flex: 1, backgroundColor: '#304A7E', justifyContent:'center', alignItems:'center' }, 
  centered: { justifyContent: 'center', alignItems: 'center'},
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 30, paddingBottom:10, marginBottom:5},
  backButton: { padding:10, backgroundColor:'rgba(0,0,0,0)', borderRadius: 20 },
  backButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold'},
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', fontFamily: 'Jockey One', flex:1, textAlign:'center', textShadowColor:'rgba(0,0,0,0.5)', textShadowOffset:{width:1,height:1}, textShadowRadius:2},
  subTitle: { fontSize: 18, color: '#E0E0FF', textAlign: 'center', marginBottom: 15, fontWeight:'600'},
  levelPathScrollViewContainer: { flex: 1, position: 'relative' },
  levelCanvas: { position: 'relative' },
  levelNodeBase: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', borderWidth: 2.5, elevation: 4, shadowColor: '#000', shadowOffset: { width: 1, height: 3 }, shadowOpacity: 0.3, shadowRadius: 3, position: 'absolute' },
  levelNodeUnlocked: { backgroundColor: '#446BCF', borderColor: '#A8C0FF' },
  levelNodeLocked: { backgroundColor: 'rgb(50,50,50)', borderColor: '#546E7A', opacity:100 },
  levelNodeCompleted: { backgroundColor: 'rgba(44, 127, 46, 100)', borderColor: 'rgba(84, 167, 86, 100)' },
  levelNodeText: { fontSize: 22, color: '#FFFFFF', fontWeight: 'bold', fontFamily: 'Jockey One' },
  levelLockOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor:'rgb(20,20,20)', borderRadius:32.5, justifyContent:'center', alignItems:'center'},
  levelLockIcon: { fontSize: 24, color: '#FFFFFF' },
  levelCheckIcon: { fontSize: 24, color: '#FFFFFF' }, 
  pathConnector: { position: 'absolute', height: 8, backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 4, zIndex: 1 },
  otherResourcesButton: { backgroundColor: 'rgba(0,0,0,0.3)', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 15, marginBottom: 20, marginHorizontal: 10 },
  otherResourcesButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
});

export default ChooseWorldScreen;