// screens/ExplorationMapScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { auth, db } from '../firebase';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from '../components/AppText'; 

const ALL_GAME_WORLDS_CONFIG = [
    { id: 'English', name: 'English Isle', icon: '🇬🇧', totalLevels: 15, displayOrder: 1 },
    { id: 'Mathematics', name: 'Numberia', icon: '➕', totalLevels: 15, displayOrder: 2 },
    { id: 'Science', name: 'Cosmic Labs', icon: '🔬', totalLevels: 15, displayOrder: 3 },
    { id: 'History', name: 'Ancient Ruins', icon: '🏛️', totalLevels: 15, displayOrder: 4 },
    { id: 'Geography', name: 'Terra Explorer', icon: '🌍', totalLevels: 15, displayOrder: 5 },
    { id: 'Physics', name: 'Force & Motion', icon: '⚛️', totalLevels: 15, displayOrder: 6 },
];

const WorldNode = ({ themeId, displayName, icon, unlocked, onPress, isCompleted, dynamicStyle }) => (
    <TouchableOpacity 
        style={[ styles.worldNode, dynamicStyle, !unlocked && styles.lockedWorldNode, isCompleted && styles.completedWorldNode ]} 
        onPress={unlocked ? onPress : () => Alert.alert("Locked", `${displayName} is locked!`)}
        disabled={!unlocked && !isCompleted}
    >
        <View style={styles.worldIconContainer}><Text style={styles.worldIconText}>{icon || themeId.substring(0,1)}</Text></View>
        <Text style={styles.worldNameText} numberOfLines={2}>{displayName}</Text>
        {(!unlocked && !isCompleted) && <View style={styles.lockOverlay}><Text style={styles.lockIcon}>🔒</Text></View>}
        {isCompleted && <View style={styles.lockOverlay}><Text style={styles.lockIcon}>✔️</Text></View>} 
    </TouchableOpacity>
);

const Star = ({ style }) => <View style={[styles.star, style]} />;
const PathConnectorView = ({ style }) => <View style={[styles.pathConnector, style]} />;

const calculateNodePositions = (worlds, canvasW, canvasH) => {
    // ... (Using the calculateNodePositions function from the previous response)
    if (!canvasW || !canvasH || !worlds || worlds.length === 0) return {};
    const tempLayouts = {}; const nodeSize = 90; const padding = 30; 
    const availableHeight = canvasH - (2 * padding) - nodeSize; 
    const availableWidth = canvasW - (2 * padding) - nodeSize;
    worlds.forEach((world, index) => {
        let top, left; const numWorlds = worlds.length;
        if (numWorlds === 1) { top = canvasH / 2 - nodeSize / 2; left = canvasW / 2 - nodeSize / 2; } 
        else {
            const yRatio = index / (numWorlds - 1); top = padding + yRatio * availableHeight;
            if (numWorlds <= 2) { left = (index === 0) ? (canvasW * 0.25 - nodeSize / 2) : (canvasW * 0.75 - nodeSize / 2); }
            else if (numWorlds === 3) { if (index === 0) left = canvasW * 0.15 - nodeSize / 2; else if (index === 1) left = canvasW * 0.5 - nodeSize / 2; else left = canvasW * 0.85 - nodeSize / 2; }
            else if (numWorlds >= 4) { left = (index % 2 === 0) ? (canvasW * 0.3 - nodeSize / 2) : (canvasW * 0.7 - nodeSize / 2); }
            else { left = canvasW / 2 - nodeSize / 2; }
        }
        left = Math.max(padding, Math.min(left, canvasW - nodeSize - padding));
        top = Math.max(padding, Math.min(top, canvasH - nodeSize - padding));
        tempLayouts[world.id] = { top, left, width: nodeSize, height: nodeSize, zIndex: 10 + index, calculated: true };
    });
    return tempLayouts;
  };

const ExplorationMapScreen = () => {
  const navigation = useNavigation();
  const currentUser = auth.currentUser;
  const [userData, setUserData] = useState(null); 
  const [activeUserWorlds, setActiveUserWorlds] = useState([]);
  const [nodeLayouts, setNodeLayouts] = useState({}); 
  const [pathConnectorStyles, setPathConnectorStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapCanvasLayout, setMapCanvasLayout] = useState(null);

  useFocusEffect( /* ... same data fetching logic for userData and activeUserWorlds ... */ 
    useCallback(() => {
      let isActive = true;
      const fetchUserData = async () => {
        if (!currentUser) { if (isActive) { navigation.replace('Auth'); setLoading(false); } return; }
        if (isActive) setLoading(true);
        const userRef = db.collection('users').doc(currentUser.uid);
        const unsubscribeSnapshot = userRef.onSnapshot(doc => {
          if (!isActive) { if (typeof unsubscribeSnapshot === 'function') unsubscribeSnapshot(); return; }
          if (doc.exists) {
            const data = doc.data(); setUserData(data);
            if (data.learningSubjects && Array.isArray(data.learningSubjects)) {
              const filteredWorlds = ALL_GAME_WORLDS_CONFIG.filter(w => data.learningSubjects.includes(w.id)).sort((a,b) => (a.displayOrder||99) - (b.displayOrder||99));
              setActiveUserWorlds(filteredWorlds);
            } else { setActiveUserWorlds([]); }
          } else { setUserData(null); setActiveUserWorlds([]); }
          if(isActive) setLoading(false);
        }, err => { if (isActive) { console.error("Map Err:", err); setLoading(false); }});
        return unsubscribeSnapshot; 
      };
      const unsubProm = fetchUserData();
      return () => { 
        isActive = false; 
        unsubProm.then(unsub => { if (typeof unsub === 'function') unsub(); }).catch(e => console.error("Map Unsub Err:", e));
      };
    }, [currentUser, navigation])
  );

  useEffect(() => {
    if (mapCanvasLayout && activeUserWorlds.length > 0) {
      const newLayouts = calculateNodePositions(activeUserWorlds, mapCanvasLayout.width, mapCanvasLayout.height);
      setNodeLayouts(newLayouts);
    }
  }, [mapCanvasLayout, activeUserWorlds]);


  useEffect(() => {
    const allNodesHaveLayout = activeUserWorlds.every(world => nodeLayouts[world.id]?.calculated);
    if (allNodesHaveLayout && activeUserWorlds.length > 1 && mapCanvasLayout) {
      const paths = [];
      for (let i = 0; i < activeUserWorlds.length - 1; i++) {
        const startNodeLayout = nodeLayouts[activeUserWorlds[i].id];
        const endNodeLayout = nodeLayouts[activeUserWorlds[i+1].id];
        if (startNodeLayout && endNodeLayout) {
          const startX = startNodeLayout.left + startNodeLayout.width / 2; const startY = startNodeLayout.top + startNodeLayout.height / 2;
          const endX = endNodeLayout.left + endNodeLayout.width / 2; const endY = endNodeLayout.top + endNodeLayout.height / 2;
          const deltaX = endX - startX; const deltaY = endY - startY;
          const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
          const pathStyle = { width: length, left: startX, top: startY - 3.5, transform: [ { translateX: -length / 2 }, { rotate: `${angle}deg` }, { translateX: length / 2 } ], zIndex: 5 };
          paths.push(pathStyle);
        }
      }
      setPathConnectorStyles(paths);
    } else { setPathConnectorStyles([]); }
  }, [nodeLayouts, activeUserWorlds, mapCanvasLayout]);

  if (loading) return <View style={[styles.screenContainerForLoading, styles.centered]}><ActivityIndicator size="large" color="#FFFFFF" /></View>;

  return (
    <View style={styles.screenContainer}>
      {/* CSS-Art Background Elements - These are direct children of screenContainer and fill it */}
      <LinearGradient colors={['#0A1931', '#185ADB', '#2D9CDB']} style={styles.skyGradient} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} />
      <Star style={{top: '5%', left: '10%'}} /> 
      <Star style={{top: '8%', left: '30%'}} /> 
      <Star style={{top: '6%', left: '55%'}} />
      <Star style={{top: '10%', left: '80%'}} /> 
      <Star style={{top: '3%', left: '90%'}} /> 
      <Star style={{top: '12%', left: '15%'}} />
      <Star style={{top: '17%', left: '30%'}} />
      <Star style={{top: '20%', left: '90%'}} />
      <Star style={{top: '28%', left: '45%'}} />
      <Star style={{top: '32%', left: '80%'}} />
      <Star style={{top: '35%', left: '90%'}} />
      <Star style={{top: '37%', left: '75%'}} />
      <Star style={{top: '40%', left: '50%'}} />
      <Star style={{top: '42%', left: '65%'}} />
      <View style={[styles.cloud, styles.cloud1]} /> 
      <View style={[styles.cloud, styles.cloud2, { backgroundColor: 'rgba(230, 235, 240, 0.8)' }]} />
      <View style={[styles.cloud, styles.cloud3]} /> 
      <View style={[styles.cloud, styles.cloud4, { backgroundColor: 'rgba(220, 225, 230, 0.85)' }]} />
      <View style={[styles.mountain, styles.mountainFar1]} /> 
      <View style={[styles.mountain, styles.mountainFar2]} />
      <View style={[styles.mountain, styles.mountainMid1]} /> 
      <View style={[styles.mountain, styles.mountainMid2]} />
      <View style={[styles.mountainSnowCap, styles.mountainMid1Snow]}/>
      <View style={[styles.tree, styles.tree1]} /> 
      <View style={[styles.tree, styles.tree2]} />
      <View style={[styles.tree, styles.tree3]} /> 
      <View style={[styles.tree, styles.tree4]} />
      <View style={styles.groundElement} />
      {/* End CSS-Art */}

      {/* Header - On top of CSS Art */}
      <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Main')}><Text style={styles.backButtonText}>{'< Menu'}</Text></TouchableOpacity>
          <Text style={styles.title}>World Map</Text><View style={{width: 60}} />
      </View>

      {/* ScrollView for Map Content (Nodes and Paths) - This layers on top of the CSS art */}
      <View 
        style={styles.mapCanvasContainer} // This container is now positioned relative to the header
        onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            if (!mapCanvasLayout || mapCanvasLayout.width !== width || mapCanvasLayout.height !== height) {
                setMapCanvasLayout({ width, height });
            }
        }}
      >
        {mapCanvasLayout && (
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.mapCanvasScrollViewContent} 
                style={styles.mapScrollLayerItself}
            >
                {/* The mapCanvas View now gets its dimensions from mapCanvasLayout */}
                <View style={[styles.mapCanvas, {width: mapCanvasLayout.width, height: mapCanvasLayout.height}]}> 
                    {activeUserWorlds.length === 0 && !loading && (
                        <View style={styles.centeredMessageContainer}><Text style={styles.centeredMessageText}>No worlds selected!</Text></View>
                    )}
                    
                    {pathConnectorStyles.map((pathStyle, index) => (
                        <PathConnectorView key={`path-${index}`} style={pathStyle} />
                    ))}

                    {activeUserWorlds.map((worldConfig, index) => {
                        let isUnlocked = index === 0; 
                        if (index > 0 && userData) {
                            const prevWorld = activeUserWorlds[index - 1];
                            const progressInPrev = userData.currentLevelByTheme?.[prevWorld.id] || 0;
                            if (progressInPrev >= prevWorld.totalLevels) isUnlocked = true;
                        }
                        const highestCompletedInThis = userData?.currentLevelByTheme?.[worldConfig.id] || 0;
                        const isThemeCompleted = highestCompletedInThis >= worldConfig.totalLevels;
                        
                        return (
                            <WorldNode
                                key={worldConfig.id}
                                themeId={worldConfig.id} 
                                displayName={worldConfig.name}
                                icon={worldConfig.icon}
                                unlocked={isUnlocked || isThemeCompleted}
                                isCompleted={isThemeCompleted}
                                dynamicStyle={nodeLayouts[worldConfig.id] || {opacity:0}} 
                                onPress={() => navigation.navigate('ChooseWorld', { worldId: worldConfig.id, worldName: worldConfig.name, totalLevelsInWorld: worldConfig.totalLevels })}
                            />
                        );
                    })}
                </View>
            </ScrollView>
        )}
      </View>
    </View>
  );
};

// Styles from the version that included the full CSS art background
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#65A2FE' },
  screenContainerForLoading: { flex: 1, backgroundColor: '#65A2FE', justifyContent: 'center', alignItems: 'center' },
  
  skyGradient: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  star: { position: 'absolute', width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(255, 255, 200, 0.8)', zIndex: 1 },
  cloud: { position: 'absolute', backgroundColor: 'rgba(240, 245, 250, 0.85)', zIndex: 2, borderRadius: 50, },
  cloud1: { width: 180, height: 80, top: '20%', left: '-10%', borderRadius: 40 },
  cloud2: { width: 220, height: 100, top: '15%', left: '30%', borderRadius: 50 },
  cloud3: { width: 150, height: 70, top: '22%', left: '75%', borderRadius: 35 },
  cloud4: { width: 200, height: 90, top: '30%', left: '0%', borderRadius: 45 },
  mountain: { position: 'absolute', width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftColor: 'transparent', borderRightColor: 'transparent', zIndex: 3 },
  mountainFar1: { borderLeftWidth: 100, borderRightWidth: 100, borderBottomWidth: 180, borderBottomColor: '#2c3e50', bottom: '15%', left: '0%' },
  mountainFar2: { borderLeftWidth: 80, borderRightWidth: 80, borderBottomWidth: 150, borderBottomColor: '#34495e', bottom: '15%', left: '60%' },
  mountainMid1: { borderLeftWidth: 120, borderRightWidth: 120, borderBottomWidth: 220, borderBottomColor: '#7f8c8d', bottom: '10%', left: '25%' },
  mountainMid2: { borderLeftWidth: 90, borderRightWidth: 90, borderBottomWidth: 160, borderBottomColor: '#95a5a6', bottom: '10%', left: '5%' }, 
  mountainSnowCap: { position: 'absolute', width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftColor: 'transparent', borderRightColor: 'transparent', borderLeftWidth: 50, borderRightWidth: 50, borderBottomWidth: 90, borderBottomColor: 'rgba(220, 220, 240, 0.9)', zIndex: 4 },
  mountainMid1Snow: { bottom: '25.5%', left: '43%' },
  tree: { position: 'absolute', width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftColor: 'transparent', borderRightColor: 'transparent', zIndex: 4 },
  tree1: { borderLeftWidth: 45, borderRightWidth: 45, borderBottomWidth: 120, borderBottomColor: '#16a085', bottom: '12%', left: '10%' },
  tree2: { borderLeftWidth: 35, borderRightWidth: 35, borderBottomWidth: 110, borderBottomColor: '#1abc9c', bottom: '8%', left: '20%' },
  tree3: { borderLeftWidth: 35, borderRightWidth: 35, borderBottomWidth: 90, borderBottomColor: '#16a085', bottom: '11%', left: '75%' },
  tree4: { borderLeftWidth: 20, borderRightWidth: 20, borderBottomWidth: 90, borderBottomColor: '#27ae60', bottom: '9%', left: '65%' },
  groundElement: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '15%', backgroundColor: '#2c3e50', zIndex: 3, borderTopWidth:2, borderTopColor:'#1e2b37'},

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingBottom:10, paddingHorizontal: 15, position: 'absolute', top:0, left:0, right:0, zIndex: 20 },
  backButton: { padding: 5, backgroundColor:'rgba(0,0,0,0)', borderRadius:5 },
  backButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', fontFamily: 'Jockey One', textAlign:'center', flex:1 },
  
  mapCanvasContainer: { flex: 1, zIndex: 5, marginTop: 80 /* Header approx height */ },
  mapScrollLayerItself: { flex: 1 }, 
  //mapCanvasScrollViewContent: { flexGrow: 1 }, 
  mapCanvas: { position: 'relative' ,marginTop: 140, marginBottom:140},
  centered: { justifyContent: 'center', alignItems: 'center', flex:1 },
  centeredMessageContainer: { position:'absolute', top:'40%', left:'5%', right:'5%', alignItems:'center', zIndex: 6},
  centeredMessageText: { fontSize: 18, fontWeight: 'bold', color: '#FFF', textAlign:'center'},
  
  worldNode: { width: 90, height: 90, borderRadius: 20, backgroundColor: 'rgba(44, 127, 46, 100)', justifyContent: 'center', alignItems: 'center', padding: 5, position: 'absolute', borderWidth: 1, borderColor: 'rgba(44, 127, 46, 100)', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1.25, shadowRadius: 6 },
  lockedWorldNode: { backgroundColor: 'rgba(96, 125, 139, 0.8)', borderColor: 'rgba(69, 90, 100, 0.95)' },
  completedWorldNode: { backgroundColor: 'rgba(76, 175, 80, 0.9)', borderColor: 'rgba(165, 214, 167, 0.95)' },
  worldIconContainer: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  worldIconText: { fontSize: 18, color: '#FFF' },
  worldNameText: { fontSize: 10, color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center', marginTop:2 },
  lockOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor:'rgba(0,0,0,0.3)', borderRadius:42.5, justifyContent:'center', alignItems:'center'},
  lockIcon: { fontSize: 20, color: '#FFFFFF' },
  
  pathConnector: {
    position: 'absolute',
    height: 7, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    borderRadius: 3.5,
    // transformOrigin: 'left center', // Conceptually
  }
});

export default ExplorationMapScreen;