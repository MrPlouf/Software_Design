// screens/HelpScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from '../components/AppText';

const HelpScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>{'< Back'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Help Available</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
            style={[styles.helpButton, styles.tutorialButton]} 
            onPress={() => navigation.navigate('Tutorial')}
        >
          <Text style={styles.helpButtonText}>Tutorial</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.helpButton, styles.lifelineButton]} 
            onPress={() => Alert.alert("Lifeline", "Lifeline info/feature here.")} // Or navigate to a LifelineScreen
        >
          <Text style={styles.helpButtonText}>Lifeline</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.helpButton, styles.settingsButton]} 
            onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.helpButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
      
      {/* The main content area of the selected help section would go below the buttons */}
      {/* For now, this screen just acts as a navigator to other help sections */}
      <View style={styles.contentArea}>
        <Text style={styles.contentText}>Select an option above to view details.</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // Adjusted for custom back button
    paddingHorizontal: 20,
    backgroundColor: '#81A9FF',
  },
  backButtonWrapper: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Jockey One',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  helpButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20, // More rounded
    minWidth: 100,
    alignItems: 'center',
    elevation: 2,
  },
  tutorialButton: {
    backgroundColor: '#446BCF',
  },
  lifelineButton: {
    backgroundColor: '#5cb85c', // Greenish
  },
  settingsButton: {
    backgroundColor: '#f0ad4e', // Orangish
  },
  helpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  contentArea: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)', // Slight overlay for content
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentText: {
      fontSize: 18,
      color: '#FFFFFF',
      textAlign: 'center'
  }
});

export default HelpScreen;