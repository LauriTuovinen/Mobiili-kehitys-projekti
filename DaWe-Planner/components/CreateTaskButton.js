import { View, Button } from "react-native";
import { StyleSheet } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView

export default function CreateTaskButton() {
  const pressHandler = () => {
    console.log("button pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <Ionicons.Button
          name="add-outline"
          size={32}
          onPress={pressHandler}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute', // Use absolute positioning
    right: 20, // Align to right edge
    bottom: 60, // Align to bottom edge
    
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#ccc'
  }
});
    

