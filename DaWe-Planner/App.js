import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import * as SQLite from "expo-sqlite"
import { useState, useEffect } from 'react';
import Navigation from './components/navigation';

 //SQLite should always be used in app.js to avoid any errors
export default function App() {
  const db = SQLite.openDatabase("example.db")
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(undefined);
  //This creates a new table if table doesn't exist yet
  useEffect(()=>{
    db.transaction(tx=>{
      tx.executeSql("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)")
    });
  //This gets all data from table tasks
    db.transaction(tx=>{
      tx.executeSql("SELECT * FROM tasks", null,
      (txObj, resultSet) => setTasks(resultSet.rows._array),
      (txObj, error) => console.log(error)
      );
    });

    setIsLoading(false);
  }, []);
  //Load screen if fetching data takes a while
  if(isLoading){
    return(
      <View style={styles.container}>
      <Text>Loading data...</Text>
    </View>
    );
  }
  // Logic for adding a task
  const addTask = () => {
    db.transaction(tx => {
      tx.executeSql("INSERT INTO tasks (name) values (?)", [currentTask],
      (txObj, resultSet) => {
        let existingTasks = [...tasks]; //[...tasks], this basically unpacks and clones an array without modifying the original array
        existingTasks.push({ id: resultSet.insertId, name: currentTask});
        setTasks(existingTasks);
        setCurrentTask(undefined);
      },
      (txObj, error) => console.log(error)
      );
    });
  }
  //Logic for deleting tasks
  const deleteTask = (id) =>{
    db.transaction(tx=>{
      tx.executeSql("DELETE FROM tasks WHERE id = ?",[id],
      (txObj, resultSet) =>{
        if(resultSet.rowsAffected > 0){
          let existingTasks = [...tasks].filter(name=>name.id !==id);
          setTasks(existingTasks);
        }
      },
      (txObj, error) => console.log(error)
      );
    });
  };
  //Logic for updating tasks
  const updateTask = (id) =>{
    db.transaction(tx=>{
      tx.executeSql("UPDATE tasks SET name = ? WHERE id = ?",[currentTask, id],
        (txObj, resultSet) =>{
          if(resultSet.rowsAffected>0){
            let existingTasks = [...tasks];
            const indexToUpdate = existingTasks.findIndex(name => name.id ===id);
            existingTasks[indexToUpdate].name = currentTask;
            setTasks(existingTasks);
            setCurrentTask(undefined);
          }
        },
        (txObj, error) => console.log(error)
      );
    });
  }

  //Logic for showing tasks
  const showTasks = () =>{
    return tasks.map((task, index) =>{
      return(
        <View key={index} style ={styles.row}>
          <Text>{task.name}</Text>
          <Button title='mark as done' onPress={()=>deleteTask(task.id)}></Button>
          <Button title="edit" onPress={()=>updateTask(task.id)}></Button>
        </View>
      )
    });
  };

  return (
    <View style={styles.container}>
      <Navigation />
      <TextInput value={currentTask} placeholder='type task here' onChangeText={setCurrentTask}/>
      <Button title='add a task' onPress={addTask}></Button>
      {showTasks()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
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
