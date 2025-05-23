import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MindMaster</Text>
      <Text style={styles.subtitle}>Welcome to the Game!</Text>
      
      <TouchableOpacity 
        style={[styles.button, styles.signInButton]}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.registerButton]}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      {/* Optional: Guest Mode */}
      <TouchableOpacity 
        style={[styles.button, styles.guestButton]}
        onPress={() => navigation.navigate('Game')} // Directly to game as guest
      >
        <Text style={styles.buttonText}>Play as Guest</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#81A9FF',
  },
  title: {
    fontSize: 48, // Larger title
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    fontFamily: 'Jockey One', // Make sure this font is loaded
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 50, // More space
    color: '#E0E0E0', // Lighter subtitle
    textAlign: 'center',
  },
  button: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 25, // Rounded buttons
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  signInButton: {
    backgroundColor: "#446BCF", // Darker blue for sign in
  },
  registerButton: {
    backgroundColor: '#6c757d', // Grey for register
  },
  guestButton: {
    backgroundColor: '#28a745', // Green for guest
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;