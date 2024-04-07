import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import database from './components/database';
import { useState, useEffect } from 'react';
import Navigation from './components/navigation';
import WeeklyScreen from './screens/Weekly';
import CreateTask from './screens/CreateTask';

 //SQLite should always be used in app.js to avoid any errors
export default function App() {
  const db = database.db;
  database.createDB(db);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Navigation />
    </View>
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
