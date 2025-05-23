// screens/AuthLoadingScreen.js
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Alert } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native'; // Added CommonActions
import { auth, db } from '../firebase';

const AuthLoadingScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    console.log("AuthLoadingScreen: Mounting and subscribing for initial auth check.");
    
    // This listener primarily handles the initial check when the app loads.
    // Subsequent navigations after login/signup are handled by those screens directly.
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("AuthLoadingScreen: onAuthStateChanged (initial check) - User:", user ? user.uid : 'null');
      if (user) {
        try {
          const userDocRef = db.collection('users').doc(user.uid);
          const userDoc = await userDocRef.get();

          let routeName;
          if (userDoc.exists && userDoc.data().initialSetupComplete === true) {
            routeName = 'MainApp';
            console.log("AuthLoadingScreen: User persisted, setup complete. Resetting to MainApp.");
          } else {
            // If user exists but setup not complete, or doc doesn't exist (e.g., error during signup)
            routeName = 'InitialSetup';
            console.log("AuthLoadingScreen: User persisted, setup INCOMPLETE or doc missing. Resetting to InitialSetup.");
          }
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: routeName }],
            })
          );
        } catch (error) {
          console.error("AuthLoadingScreen: Error processing persisted user document:", error);
          Alert.alert("Loading Error", "Could not verify your session. Please log in.");
          auth.signOut().catch(signOutError => console.error("Error signing out:", signOutError));
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            })
          );
        }
      } else {
        console.log("AuthLoadingScreen: No persisted user. Resetting to Auth stack.");
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          })
        );
      }
      // It's important that this listener does its job and then potentially gets cleaned up
      // if AuthLoadingScreen unmounts due to the reset.
    });

    return () => {
      console.log("AuthLoadingScreen: Unmounting and unsubscribing from initial auth check.");
      unsubscribe();
    };
  }, [navigation]); // Only navigation as dependency

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FFFFFF" />
      <Text style={styles.loadingText}>Initializing App...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#81A9FF',
  },
  loadingText: {
      marginTop: 10,
      color: '#FFFFFF',
      fontSize: 16,
  }
});

export default AuthLoadingScreen;