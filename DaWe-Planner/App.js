import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import database from './components/database';
import { useState, useEffect } from 'react';
import Navigation from './components/navigation';
import WeeklyScreen from './screens/Weekly';
import CreateTask from './screens/CreateTask';
import { DarkModeProvider } from './components/themeContext';

export default function App() {
  const db = database.db;

  database.createDB(db);
  return (
      <DarkModeProvider>
    <View style={styles.container}>
      <StatusBar style="auto" />
        <Navigation />
    </View>
      </DarkModeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9efdb',
    justifyContent: 'center',
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "space-between",
    margin: 8
  }
});
