// screens/TutorialScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TutorialScreen = () => {
  const navigation = useNavigation();

  // This content should match your "HOW TO PLAY" image
  const tutorialContent = [
    { 
      title: "GAME OBJECTIVES",
      text: "Answer quizzes correctly to level up and improve your level."
    },
    {
      title: "HOW TO ANSWER",
      text: "Click on the correct answer from the provided choices."
    }
    // You can add more sections if needed
  ];

  return (
    <View style={styles.container}>
       <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>{'< Help'}</Text>
      </TouchableOpacity>
      <Text style={styles.mainTitle}>Tutorial</Text>
      
      <ScrollView style={styles.contentScrollView}>
        {tutorialContent.map((item, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            <Text style={styles.sectionText}>{item.text}</Text>
          </View>
        ))}

        <View style={styles.videoPlaceholder}>
            {/* Replace with your video player component or an Image linking to a video */}
            <Text style={styles.videoPlaceholderText}>HOW TO PLAY ! (Video)</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, 
    paddingHorizontal: 20,
    backgroundColor: '#81A9FF', // Matching HelpScreen
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
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Jockey One',
  },
  contentScrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#E0E0E0',
    lineHeight: 22,
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 16/9, // Common video aspect ratio
    backgroundColor: '#000000', // Black placeholder for video
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  videoPlaceholderText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default TutorialScreen;