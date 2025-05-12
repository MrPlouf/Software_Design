import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GameScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Screen</Text>
      <Text style={styles.content}>This is where the MindMaster game would be!</Text>
      <Text style={styles.content}>Imagine game elements here...</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Go Back to Home"
          onPress={() => navigation.goBack()} // Navigates to the previous screen in the stack
          color="#6c757d"
        />
      </View>
      {/* You could also navigate to other screens from here if needed */}
      {/* <Button title="Go to Settings" onPress={() => navigation.navigate('Settings')} /> */}
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
  },
  content: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    color: '#495057',
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 20,
  },
});

export default GameScreen;