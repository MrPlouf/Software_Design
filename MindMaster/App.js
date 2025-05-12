import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
// Import other screens as you create them
// import SettingsScreen from './screens/SettingsScreen';

const Stack = createStackNavigator();

const theme = {
  colors: {
    background: '#81A9FF',
  },
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home" // Sets the default screen to show
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007bff', // Example header background color
          },
          headerTintColor: '#fff', // Example header text color
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'MindMaster Home' }} // Title shown in the header

        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ title: 'Play MindMaster' }}
        />
        {/* You can add more screens here */}
        {/* <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Game Settings' }} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}