import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native";
import CreateTaskButton from "../components/CreateTaskButton";
import database, { getTasksForDate } from "../components/database";
import moment from "moment";

const db = database.db;

const DayCard = ({ day, tasks = 0 }) => {
    return(
        <View style={styles.cardContainer}>
            <Text style={[styles.cardText, { textAlign: 'right' }]}>{day.day}</Text>
            <Text style={{ textAlign: 'right' }}>{tasks} tasks</Text>
        </View>
    )
}

const WeeklyScreen = () =>{
    const [days, setDays] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
      const getTasks = async () => {
        const taskData = await database.getAllTasks(db);
        setTasks(taskData);
        console.log(tasks);
    };
    getTasks();
      const weekStart = moment().startOf('week'); // Set to Monday by default
      const weekDays = [];
      
      for (let i = 0; i < 7; i++) {
        const currentDay = weekStart.clone().add(i, 'days');
        const formattedDate = currentDay.format('DD/MM/YYYY')
        console.log(formattedDate);
        weekDays.push({ day: formattedDate});
      }
      setDays(weekDays);

      
    }, []);

    return (
        <View style={styles.container}>
          <Text style={[styles.cardText, {fontSize: 22}, {paddingTop:10}]}> Week {moment().week()}</Text>
          <FlatList
            data={days}
            renderItem={({ item }) => <DayCard day={item} />}
            keyExtractor={(item) => item.day}
            showsVerticalScrollIndicator={false}
          />
          <CreateTaskButton/>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#f9efdb"
    },
    cardContainer: {
      backgroundColor: '#ffdac1',
      padding: 20,
      margin: 5,
      borderRadius: 5,
      height: 100,
      shadowColor:"#000000",
      shadowOffset: { width: 0, height:3},
      shadowOpacity: 0.3,
      shadowRadius: 2,
      
    },
    cardText: {
      fontSize: 16,
      fontWeight: "bold"
    },
  });

export default WeeklyScreen;