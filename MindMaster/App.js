// App.js
import React, { useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Import your screens
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import HomeScreen from './screens/HomeScreen'; 
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import InitialSetupScreen from './screens/InitialSetupScreen';
import MainScreen from './screens/MainScreen'; 
import GameScreen from './screens/GameScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen'; 
import ExplorationMapScreen from './screens/ExplorationMapScreen';
import ChooseWorldScreen from './screens/ChooseWorldScreen';
import HelpScreen from './screens/HelpScreen';
import TutorialScreen from './screens/TutorialScreen';


const Stack = createStackNavigator();

SplashScreen.preventAutoHideAsync();

const screenOptions = {
  headerStyle: { backgroundColor: '#007bff' },
  headerTintColor: '#fff', 
  headerTitleStyle: { fontWeight: 'bold', fontFamily: 'Jockey One' },
  headerBackTitleVisible: false,
};

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeLanding" component={HomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ExplorationMap" component={ExplorationMapScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ChooseWorld" component={ChooseWorldScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Help" component={HelpScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Tutorial" component={TutorialScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Game" component={GameScreen} options={{ title: 'Play MindMaster' }} />
    <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Game Settings' }} />
  </Stack.Navigator>
);

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Jockey One': require('./assets/fonts/JockeyOne-Regular.ttf'), 
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="AuthLoading">
          <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
          <Stack.Screen name="Auth" component={AuthStack} />
          <Stack.Screen name="InitialSetup" component={InitialSetupScreen} />
          <Stack.Screen name="MainApp" component={AppStack} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}