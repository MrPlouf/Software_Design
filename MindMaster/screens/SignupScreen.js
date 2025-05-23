// screens/SignupScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native'; // Import CommonActions
import { auth, db } from '../firebase';
import firebase from 'firebase/compat/app';

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const navigation = useNavigation();

  const handleSignup = () => {
    console.log("SignupScreen: handleSignup triggered.");
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', "Passwords don't match.");
      return;
    }

    setLoading(true);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        if (user) {
          console.log("SignupScreen: User account created in Auth:", user.uid);
          db.collection('users').doc(user.uid).set({
            email: user.email,
            nickname: '', 
            difficulty: 'medium',
            language: 'English',
            initialSetupComplete: false, // New users always start with setup incomplete
            characterLook: { head: 'default_head', weapon: 'default_weapon' },
            lives: 3,
            progress: { highestLevelCompleted: 0, completedLevels: {} },
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            // setLoading(false); // setLoading(false) will be implicit due to navigation reset
            console.log("SignupScreen: User document written to Firestore. Resetting to InitialSetup.");
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'InitialSetup' }],
              })
            );
          })
          .catch(dbError => {
              setLoading(false);
              console.error("SignupScreen: Firestore Error writing document: ", dbError.code, dbError.message);
              Alert.alert('Signup Error', `Account created, but could not save profile data: ${dbError.message}. Please try logging in.`);
              // Potentially delete the auth user if Firestore write fails, then nav to Auth
              // user.delete().then(() => navigation.replace('Auth')).catch(delErr => navigation.replace('Auth'));
              // For now, let's assume they can login and InitialSetup will handle it
              navigation.dispatch(
                CommonActions.reset({ // Send to Auth so they can login and trigger setup
                  index: 0,
                  routes: [{ name: 'Auth' }],
                })
              );
          });
        } else {
            setLoading(false);
            Alert.alert('Signup Error', 'User creation failed unexpectedly after successful call.');
        }
      })
      .catch(authError => {
        setLoading(false);
        console.error("SignupScreen: Auth Error during signup:", authError.code, authError.message);
        Alert.alert('Signup Failed', `${authError.code}: ${authError.message}`);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#A9A9A9"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#A9A9A9"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#A9A9A9"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator size="large" color="#FFFFFF" style={{marginVertical: 20}} />
      ) : (
        <>
          <TouchableOpacity style={styles.buttonSignup} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </>
      )}
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
    color: '#FFFFFF',
    marginBottom: 30,
    fontFamily: 'Jockey One',
  },
  input: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    fontSize: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonSignup: {
    backgroundColor: '#446BCF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#FFFFFF',
    marginTop: 15,
    fontSize: 16,
  },
});

export default SignupScreen;