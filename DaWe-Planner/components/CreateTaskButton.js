import { View, Button } from "react-native";
import { StyleSheet } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { DarkModeContext } from "./themeContext";

const navbarColorDark = '#b95970'
const navbarColorLight = '#ffb8b1'

export default function CreateTaskButton() {
  const { darkMode } = useContext(DarkModeContext)
  const navigation = useNavigation()
  const pressHandler = () => {
    navigation.navigate('Create')
    console.log('navigate to Create task')
  };

  return (
      <View style={styles.buttonContainer}>
        <Ionicons.Button
          name="add-outline"
          color={'black'}
          size={32}
          onPress={pressHandler}
          style={darkMode ? styles.darkButton : styles.button}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute', // Use absolute positioning
    right: 20, // Align to right edge
    bottom: 30, // Align to bottom edge
  },
  button: {
    backgroundColor: navbarColorLight,
    paddingVertical: 12,   
  },
  darkButton: {
    backgroundColor: navbarColorDark,
    paddingVertical: 12,
  }
});


