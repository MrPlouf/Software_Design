// screens/CorrectedAnswersScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { auth, db } from '../firebase';
// Assuming AppText is your custom component for default font
// import AppText from '../components/AppText'; 

const CorrectedAnswerItem = ({ item }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const correctChoices = item.choices?.filter(c => c.isCorrect).map(c => c.text).join('; ') || 'N/A';

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemThemeText}>{item.themeName || 'General'} - Lvl {item.levelAnswered || 'N/A'}</Text>
        {item.masteredAt?.toDate && (
            <Text style={styles.itemDateText}>{item.masteredAt.toDate().toLocaleDateString()}</Text>
        )}
      </View>
      <Text style={styles.itemQuestionText}>{item.questionText || 'Question text missing'}</Text>
      <TouchableOpacity onPress={() => setShowAnswer(!showAnswer)} style={styles.showAnswerButton}>
        <Text style={styles.showAnswerButtonText}>{showAnswer ? 'Hide Answer' : 'Show Answer'}</Text>
      </TouchableOpacity>
      {showAnswer && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerLabel}>Correct Answer(s):</Text>
          <Text style={styles.answerText}>{correctChoices}</Text>
        </View>
      )}
    </View>
  );
};

const CorrectedAnswersScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const currentUser = auth.currentUser;
  
  const [allMasteredQuestions, setAllMasteredQuestions] = useState([]);
  const [filteredMasteredQuestions, setFilteredMasteredQuestions] = useState([]);
  const [selectedThemeFilter, setSelectedThemeFilter] = useState('All'); 
  const [availableThemesForFilter, setAvailableThemesForFilter] = useState(['All']);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && isFocused) {
      setLoading(true);
      const userRef = db.collection('users').doc(currentUser.uid);
      userRef.get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data();
            const mastered = (data.masteredQuestions || []).sort((a, b) => 
                (b.masteredAt?.toDate ? b.masteredAt.toDate().getTime() : 0) - 
                (a.masteredAt?.toDate ? a.masteredAt.toDate().getTime() : 0)
            );
            setAllMasteredQuestions(mastered);
            const themesInMastered = [...new Set(mastered.map(q => q.themeName).filter(Boolean))];
            setAvailableThemesForFilter(['All', ...themesInMastered.sort()]);
            if (selectedThemeFilter === 'All' || !themesInMastered.includes(selectedThemeFilter)) {
                setFilteredMasteredQuestions(mastered);
                if(!themesInMastered.includes(selectedThemeFilter) && selectedThemeFilter !== 'All') setSelectedThemeFilter('All');
            } else {
                setFilteredMasteredQuestions(mastered.filter(q => q.themeName === selectedThemeFilter));
            }
          } else {
            setAllMasteredQuestions([]); setFilteredMasteredQuestions([]); setAvailableThemesForFilter(['All']);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching mastered questions:", error); setLoading(false);
          Alert.alert("Error", "Could not load your mastered questions.");
        });
    } else if (!currentUser) { 
        navigation.replace('Auth'); 
        setLoading(false); 
    }
  }, [currentUser, navigation, isFocused]);

  useEffect(() => {
    if (selectedThemeFilter === 'All') setFilteredMasteredQuestions(allMasteredQuestions);
    else setFilteredMasteredQuestions(allMasteredQuestions.filter(q => q.themeName === selectedThemeFilter));
  }, [selectedThemeFilter, allMasteredQuestions]);

  const renderHeader = () => (
    <View style={styles.header}>
    </View>
  );

  if (loading) {
    return ( <View style={styles.container}>{renderHeader()}<View style={styles.centeredFull}><ActivityIndicator size="large" color="#FFFFFF" /></View></View> );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}

      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollContainer}>
          {availableThemesForFilter.map(theme => (
              <TouchableOpacity 
                  key={theme} 
                  style={[styles.filterButton, selectedThemeFilter === theme && styles.activeFilterButton]}
                  onPress={() => setSelectedThemeFilter(theme)}
              >
                  <Text style={[styles.filterButtonText, selectedThemeFilter === theme && styles.activeFilterButtonText]}>{theme}</Text>
              </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredMasteredQuestions.length === 0 ? (
        <View style={styles.centeredFull}>
          <Text style={styles.emptyText}>
            {selectedThemeFilter === 'All' ? "No mastered questions yet!" : `No mastered questions for ${selectedThemeFilter}.`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredMasteredQuestions}
          keyExtractor={(item) => item.questionId + (item.masteredAt?.seconds || Math.random().toString())}
          renderItem={({ item }) => <CorrectedAnswerItem item={item} />}
          contentContainerStyle={styles.listContentContainer}
          style={styles.listStyle}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#81A9FF' }, // Removed paddingTop, header handles it
  centeredFull: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  backButton: { paddingVertical: 5, paddingHorizontal: 10, }, // Made tappable area slightly bigger
  backButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '500', fontFamily:'JockeyOne-Regular'},
  title: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', fontFamily: 'JockeyOne-Regular', textAlign:'center', flex:1 },
  headerSpacer: { width: 60 }, // To balance the back button width for title centering
  
  filterBar: { // Container for the filter ScrollView
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  filterScrollContainer: { // For the content of the horizontal ScrollView
    paddingHorizontal: 15,
    alignItems: 'center', // Center buttons vertically if they have different text lengths
  },
  filterButton: {
    paddingVertical: 6, // Smaller padding
    paddingHorizontal: 12, // Smaller padding
    borderRadius: 15, // More rounded
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeFilterButton: {
    backgroundColor: '#FFD700', 
    borderColor: 'rgba(255,255,255,0.5)',
  },
  filterButtonText: {
    color: '#E0E0FF', // Lighter text for inactive
    fontSize: 13,
    fontFamily:'JockeyOne-Regular',
  },
  activeFilterButtonText: {
    color: '#4A6C9B', // Darker text for active
    fontWeight: 'bold',
  },

  emptyText: { fontSize: 16, color: '#D0D0E0', textAlign: 'center', paddingHorizontal: 20, fontFamily:'JockeyOne-Regular' }, // Slightly lighter
  listStyle: { flex: 1 },
  listContentContainer: { paddingHorizontal: 15, paddingTop: 15, paddingBottom: 20 },
  itemContainer: { backgroundColor: 'rgba(255,255,255,0.08)', padding: 12, borderRadius: 6, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: '#FFD700' }, // Subtler item
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5},
  itemThemeText: { fontSize: 12, color: '#A8C0FF', fontWeight: '600', fontFamily:'JockeyOne-Regular' },
  itemQuestionText: { fontSize: 14, color: '#FFFFFF', lineHeight: 19, fontFamily:'JockeyOne-Regular', marginBottom: 8 },
  itemDateText: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontFamily:'JockeyOne-Regular' },
  showAnswerButton: { backgroundColor: 'rgba(0,0,0,0.2)', paddingVertical: 6, paddingHorizontal:10, borderRadius: 4, alignSelf: 'flex-start', marginTop: 8 },
  showAnswerButtonText: { color: '#E0E0FF', fontSize: 12, fontWeight:'500', fontFamily:'JockeyOne-Regular' },
  answerContainer: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)'},
  answerLabel: { fontSize: 12, color: '#A8C0FF', fontWeight: '500', fontFamily:'JockeyOne-Regular'},
  answerText: { fontSize: 13, color: '#FFFFFF', marginTop: 2, fontFamily:'JockeyOne-Regular'},
});

export default CorrectedAnswersScreen;