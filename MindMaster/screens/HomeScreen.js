import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const HomeScreen = () => {
  const navigation = useNavigation(); // Hook to get the navigation prop


  return (
    <View style={styles.container}>
      <Text style={styles.title}>MindMaster</Text>
      <Text style={styles.subtitle}>Welcome to the Game!</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Start Without Logging in"
          onPress={() => navigation.navigate('Game')}
          color="#ffffff"
        />
        <Button
          title="Sign In"
          onPress={() => navigation.navigate('Game')}
          color="#ffffff"
        />
      </View>
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
    fontFamily: "Jockey One"
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: '#555',
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 10,
    backgroundColor: "#446BCF",
    borderColor: "#ffffff",
    borderRadius: 12
    
  },
});

export default HomeScreen;