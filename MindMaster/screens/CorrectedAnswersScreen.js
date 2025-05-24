// screens/CorrectedAnswersScreen.js
import AppText from '../components/AppText';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { auth, db } from '../firebase';

const CorrectedAnswersScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const currentUser = auth.currentUser;
  const [masteredQuestions, setMasteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && isFocused) {
      setLoading(true);
      const userRef = db.collection('users').doc(currentUser.uid);
      userRef.get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data();
            // Ensure masteredQuestions is an array, sort by masteredAt if available
            const sortedMastered = (data.masteredQuestions || []).sort((a, b) => {
                const timeA = a.masteredAt?.toDate ? a.masteredAt.toDate().getTime() : 0;
                const timeB = b.masteredAt?.toDate ? b.masteredAt.toDate().getTime() : 0;
                return timeB - timeA; // Most recent first
            });
            setMasteredQuestions(sortedMastered);
          } else {
            setMasteredQuestions([]);
            console.warn("CorrectedAnswersScreen: User document not found.");
          }
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching mastered questions:", error);
          Alert.alert("Error", "Could not load your mastered questions.");
          setMasteredQuestions([]);
          setLoading(false);
        });
    } else if (!currentUser) {
      navigation.replace('Auth');
      setLoading(false);
    }
  }, [currentUser, navigation, isFocused]);

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#FFFFFF" /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>{'< Menu'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mastered Questions</Text>
        <View style={{width:70}} />{/* Spacer to balance header */}
      </View>

      {masteredQuestions.length === 0 ? (
        <View style={styles.centeredContent}>
          <Text style={styles.emptyText}>You haven't mastered any questions yet!</Text>
          <Text style={styles.emptySubText}>Pass levels in the game to see your correctly answered questions here.</Text>
        </View>
      ) : (
        <FlatList
          data={masteredQuestions}
          keyExtractor={(item) => item.questionId + (item.masteredAt?.seconds || Math.random().toString())} // More unique key
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemThemeText}>{item.themeName || 'General'}</Text>
              <Text style={styles.itemQuestionText}>{item.questionText || 'Question text missing'}</Text>
              {item.masteredAt?.toDate && (
                  <Text style={styles.itemDateText}>
                      Mastered: {item.masteredAt.toDate().toLocaleDateString()}
                  </Text>
              )}
            </View>
          )}
          contentContainerStyle={styles.listContentContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#81A9FF', paddingTop: 30 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#81A9FF' }, // For full screen loader
  centeredContent: { flex:1, justifyContent: 'center', alignItems: 'center', padding: 20}, // For empty message
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop:25, paddingHorizontal: 20},
  backButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold'},
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', fontFamily: 'Jockey One' },
  emptyText: { fontSize: 18, fontWeight:'bold', color: '#E0E0E0', textAlign: 'center', marginBottom:10 },
  emptySubText: { fontSize: 14, color: '#D0D0FF', textAlign: 'center' },
  listContentContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  itemContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700' // Gold accent
  },
  itemThemeText: {
    fontSize: 13,
    color: '#A8C0FF',
    marginBottom: 5,
    fontWeight: '600',
  },
  itemQuestionText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  itemDateText: {
      fontSize: 11,
      color: 'rgba(255,255,255,0.7)',
      marginTop: 8,
      textAlign: 'right'
  }
});

export default CorrectedAnswersScreen;