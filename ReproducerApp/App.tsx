/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

import {LogLevel, OneSignal} from 'react-native-onesignal';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
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
}

function App(): React.JSX.Element {
  const [optedIn, setOptedIn] = useState(false);

  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    function subsciptionChanged(event) {
      console.log('Subscription changed', event);
      setOptedIn(event.current.optedIn);
    }

    // Remove this method to stop OneSignal Debugging
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);

    // OneSignal Initialization
    console.log('Initializing OneSignal');
    OneSignal.initialize(ONESIGNAL KEY GOES HERE);

    OneSignal.Location.setShared(false);

    console.log('Adding subscription change listener');
    OneSignal.User.pushSubscription.addEventListener(
      'change',
      subsciptionChanged,
    );

    return () => {
      console.log('Removing subscription change listener');
      OneSignal.User.pushSubscription.removeEventListener(
        'change',
        subsciptionChanged,
      );
    };
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            <Button
              onPress={() => {
                console.log('Opting in');
                OneSignal.User.pushSubscription.optIn();
              }}
              title="Opt In"
              color="#841584"
            />
          </Section>
          <Section title="Step Two">
            <Button
              onPress={() => {
                console.log('Opting out');
                OneSignal.User.pushSubscription.optOut();
              }}
              title="Opt Out"
              color="#841584"
            />
          </Section>
          <Section title="Step Three">
            <Button
              onPress={() => {
                console.log('Checking opted in');
                setOptedIn(OneSignal.User.pushSubscription.getOptedIn());
              }}
              title="Check Opt In"
              color="#841584"
            />
          </Section>
          <Section title="Result">
            <Text>{optedIn ? 'Opted in!' : 'Opted out!'}</Text>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
