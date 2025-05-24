// components/AppText.js
import React from 'react';
import { Text, StyleSheet } from 'react-native';

const FONT_FAMILY_APP_DEFAULT = 'JockeyOne-Regular'; // Consistent key

const AppText = (props) => {
  return (
    <Text style={[styles.defaultText, props.style]} {...props}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: FONT_FAMILY_APP_DEFAULT,
    // Add a default color if you want, e.g., color: '#FFFFFF' for your app theme
  },
});

export default AppText;