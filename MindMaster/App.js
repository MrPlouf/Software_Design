// App.js
import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, Platform } from 'react-native'; // Added Text and Platform
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
import CorrectedAnswersScreen from './screens/CorrectedAnswersScreen';

const Stack = createStackNavigator();
SplashScreen.preventAutoHideAsync();

// Define font family name for consistency
const FONT_FAMILY_REGULAR = 'JockeyOne-Regular';
// const FONT_FAMILY_BOLD = 'JockeyOne-Bold'; // If you had a bold variant

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    // Use descriptive keys that match how you'll refer to them in styles
    [FONT_FAMILY_REGULAR]: require('./assets/fonts/JockeyOne-Regular.ttf'), 
    // [FONT_FAMILY_BOLD]: require('./assets/fonts/JockeyOne-Bold.ttf'), // Example if you add bold
  });
  
  useEffect(() => {
    if (fontError) {
        console.error("Font Loading Error in App.js:", fontError);
        // You might want to show a generic error to the user or use system default fonts
    }
    // console.log("App.js: App mounted, fontsLoaded:", fontsLoaded);
  }, [fontsLoaded, fontError]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) { // Hide splash if fonts loaded or if there was an error (to not hang indefinitely)
      try { 
        await SplashScreen.hideAsync(); 
        // console.log("App.js: Splash screen hidden.");
      } catch (e) { 
        console.warn("SplashScreen.hideAsync error in App.js", e); 
      }
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) { // Still loading fonts and no error yet
    return null; // Keep splash screen visible
  }

  // ---- Global Default Font for <Text> (More Advanced - Alternative to custom AppText) ----
  // This is one way to attempt to set a default, but it can have side effects and
  // might not be picked up by all libraries or deeply nested components perfectly.
  // A custom <AppText> component is generally more robust for app-wide content text.
  // const oldRender = Text.render;
  // Text.render = function (...args) {
  //   const origin = oldRender.call(this, ...args);
  //   return React.cloneElement(origin, {
  //     style: [{ fontFamily: FONT_FAMILY_REGULAR, color: '#FFFFFF' }, origin.props.style], // Default text color white for dark theme
  //   });
  // };
  // ---- End Global Default Font (Use with caution or prefer custom AppText) ----

  return (
    <View style={{ flex: 1, backgroundColor: '#81A9FF' /* Match your app's base bg */ }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
}

// Root navigator to hold all stacks
const RootNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="AuthLoading">
    <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
    <Stack.Screen name="Auth" component={AuthStack} />
    <Stack.Screen name="InitialSetup" component={InitialSetupScreen} />
    <Stack.Screen name="MainApp" component={AppStack} />
  </Stack.Navigator>
);


const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeLanding" component={HomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

// AppStack now uses the loaded font for its headers
const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
        // Default header styles for screens in this stack
        headerShown: true, // Show headers by default, individual screens can override
        headerStyle: { 
            backgroundColor: '#446BCF', // Example header color from your theme
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
        },
        headerTintColor: '#FFFFFF', // Color of back button and title
        headerTitleStyle: {
            fontFamily: FONT_FAMILY_REGULAR, // Apply your loaded font
            fontWeight: Platform.OS === 'ios' ? '600' : 'normal', // Default font weight might be needed
            fontSize: 20,
        },
        headerBackTitleVisible: false, // No "Back" text on iOS, just arrow
        headerTitleAlign: 'center', // Center title
    }}
  >
    <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ExplorationMap" component={ExplorationMapScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ChooseWorld" component={ChooseWorldScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Game" component={GameScreen} options={{ headerShown: false }} />
    <Stack.Screen 
        name="CorrectedAnswers" 
        component={CorrectedAnswersScreen} 
        options={{ 
            // Example of a screen that MIGHT use the default header
            title: 'Mastered Questions', // Title for this screen
            headerShown: true 
        }} 
    />
  </Stack.Navigator>
);