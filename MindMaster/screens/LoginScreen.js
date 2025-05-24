// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native'; // Import CommonActions
import { auth, db } from '../firebase'; // Path to your firebase.js
import AppText from '../components/AppText';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  // console.log("LoginScreen: Navigation object:", navigation); // For debugging if needed

  const handleLogin = () => {
    console.log("LoginScreen: handleLogin triggered.");
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password.');
      console.log("LoginScreen: Email or password empty.");
      return;
    }
    setLoading(true);
    console.log("LoginScreen: Attempting to sign in with email:", email);

    auth
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log("LoginScreen: Sign-in successful for UID:", user.uid);

        if (user) {
          db.collection('users').doc(user.uid).get()
            .then(doc => {
              // setLoading(false); // setLoading(false) will be implicit due to navigation reset
              let routeName;
              if (doc.exists && doc.data().initialSetupComplete === true) {
                routeName = 'MainApp';
                console.log("LoginScreen: User doc exists & initialSetupComplete is TRUE. Resetting to MainApp.");
              } else {
                routeName = 'InitialSetup';
                console.log("LoginScreen: User doc missing or initialSetupComplete is FALSE/missing. Resetting to InitialSetup.");
              }
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: routeName }],
                })
              );
            })
            .catch(dbError => {
              setLoading(false); // Explicitly set loading false on DB error before alert/nav
              console.error("LoginScreen: Error fetching user document after login:", dbError);
              Alert.alert("Login Error", "Could not retrieve user profile. Please proceed to setup.");
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'InitialSetup' }], // Fallback to InitialSetup
                })
              );
            });
        } else {
            setLoading(false);
            Alert.alert("Login Error", "User authentication failed unexpectedly after successful call.");
        }
      })
      .catch(error => {
        setLoading(false);
        console.error("LoginScreen: Sign-in auth error.", error.code, error.message);
        Alert.alert('Login Failed', `${error.code}: ${error.message}`);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mind Master</Text>
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
      {loading ? (
        <ActivityIndicator size="large" color="#FFFFFF" style={{marginVertical: 20}} />
      ) : (
        <>
          <TouchableOpacity style={styles.buttonSignIn} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonRegister} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.buttonText}>Register</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
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
  buttonSignIn: {
    backgroundColor: '#446BCF', 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '90%',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonRegister: {
    backgroundColor: '#6c757d', 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '90%',
    alignItems: 'center',
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
});

export default LoginScreen;