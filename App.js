/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';

import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {firebase} from '@react-native-firebase/app';

firebase.initializeApp({
  apiKey: 'AIzaSyDQPUc6VI6RrthxujOCIPsq56YHkUHCwMQ',
  authDomain: '',
  databaseURL: '',
  projectId: 'dark-geography-324211',
  storageBucket: '',
  messagingSenderId: '',
  appId: '1:1019680806607:android:b2cd1d00570029c06389ba',
  measurementId: ''
});  

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    initStripe({
      publishableKey: "pk_test_51M4FRuBmPYKY5Nu3jm8gdDK21EYH80zOHlxGuZwIKhi2lLF3EPMs4DsGzlkAzvze7VUCKL7iQ6bi0H6kIbcIKehp00osClaLmY",
      merchantIdentifier: 'merchant.com.{{YOUR_APP_NAME}}',
      urlScheme: "your-url-scheme",
    });
  }, []);

  <StripeProvider
    publishableKey="pk_test_51M4FRuBmPYKY5Nu3jm8gdDK21EYH80zOHlxGuZwIKhi2lLF3EPMs4DsGzlkAzvze7VUCKL7iQ6bi0H6kIbcIKehp00osClaLmY"
    urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
  >
    {/* // Your app code here */}
  </StripeProvider>
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
