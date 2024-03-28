import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native";
import CreateTaskButton from "../components/CreateTaskButton";

const DayCard = ({ day, tasks = "4 tasks" }) => {

    return(
        <View style={styles.cardContainer}>
            <Text style={[styles.cardText, { textAlign: 'right' }]}>{day.day}</Text>
            <Text style={{ textAlign: 'right' }}>{tasks}</Text>
        </View>
    )
}


const WeeklyScreen = () =>{
    const [days, setDays] = useState([]);
    useEffect(()=> {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        setDays(days.map((day)=>({day})));
    },[]);

    return (
        <View style={styles.container}>
          <Text style={[styles.cardText, {fontSize: 22}, {paddingTop:10}]}>Week number</Text>
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