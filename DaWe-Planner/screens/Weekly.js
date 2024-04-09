import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native";
import CreateTaskButton from "../components/CreateTaskButton";
import moment from "moment";
import database, { getTaskAmount } from "../components/database";

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
      const weekStart = moment().startOf('week'); // Set to Monday by default
      const weekDays = [];
      
      for (let i = 0; i < 7; i++) {
        const currentDay = weekStart.clone().add(i, 'days');
        const formattedDate = currentDay.format('DD/MM/YYYY')
        weekDays.push({ day: formattedDate});
      }
      setDays(weekDays);

      const fetchAmountOfTasks = async () => {
        const tasksPerDay = await Promise.all(
          weekDays.map(async day =>{
            const taskCount = await getTaskAmount(db, day.day);
            console.log(`Fetched task count for ${day.day}: ${taskCount}`);
            return { ...day, tasks : taskCount}
          })
        )
        console.log('Tasks per day:', tasksPerDay);
        setTasks(tasksPerDay);
      }
        fetchAmountOfTasks();
      
    }, []);

    return (
        <View style={styles.container}>
          <Text style={[styles.cardText, {fontSize: 22}, {paddingTop:10}]}> Week {moment().week()}</Text>
          <FlatList
            data={days}
            renderItem={({ item }) => {
              const matchingTaskData = tasks.find(dayData => dayData.day === item.day);
              console.log('Matching data for', item.day, ':', matchingTaskData);
              const taskCount = matchingTaskData?.tasks || 0; 
              return <DayCard day={item} tasks={taskCount} />;
            }}
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