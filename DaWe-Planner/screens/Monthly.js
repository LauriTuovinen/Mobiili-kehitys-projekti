import { Card, Icon, Text } from "@rneui/themed";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StatusBar, StyleSheet, Touchable, TouchableOpacity, View } from "react-native";
import CreateTaskButton from "../components/CreateTaskButton";
import 'moment/locale/en-gb'
import { useNavigation } from "@react-navigation/native";
import database from "../components/database";

const bgColorLight = '#f9efdb'
const cardColorLight = '#ffdac1'
const navbarColorLight = '#ffb8b1'

var moment = require('moment');
const db = database.db;

function Monthly() {
    var month = new Date().getMonth() + 1
    const [monthName, setMonthName] = useState('');
    const [monthNumber, setMonthNumber] = useState(month);
    const [weekNumbers, setWeekNumbers] = useState([]);
    const navigation = useNavigation();
    
    
    //get all tasks
    const getTasks = async (newWeekNumbers) => {
        // dropTaskTable(db)
        const taskData = await database.getAllTasks(db)

        // These loops check how many task dates are between each start and end state of each week and adds the number to newWeekNumbers numberOfTasks
        for (var i = 0; i < taskData._array.length; i++) {
            const taskDate = moment(taskData._array[i].date, 'DD/MM/YYYY')
            for (var j = 0; j < newWeekNumbers.length; j++) {
                const weekStart = moment(newWeekNumbers[j].weekStarts);
                const weekEnd = moment(newWeekNumbers[j].weekEnds);
                if (taskDate.isBetween(weekStart, weekEnd, null, '[]')) {
                    newWeekNumbers[j].numberOfTasks++
                }
            }
        }
        setWeekNumbers(newWeekNumbers)
    }

    function getWeeks(month) {
        //Gets start date of the month, end date of the month and start of the month.
        var startOfGivenMonth = moment().month(month - 1).startOf('month')//months here are from 0-11, hence the -1
        var EndOfGivenMonth = moment(startOfGivenMonth).endOf('month')
        let startOfWeek = moment(startOfGivenMonth).startOf('isoWeek')

        const weeksInMonth = []
        //While start of the weeks is before the month ends, get the end of the week based on the start of week and push the end ans start dates to and rray.
        while (startOfWeek.isBefore(EndOfGivenMonth)) {

            const endOfWeek = moment(startOfWeek).endOf('isoWeek')
            weeksInMonth.push({
                start: startOfWeek,
                end: endOfWeek
            })
            startOfWeek = moment(endOfWeek).add(1, 'days') //One day is added to the start of week, so next new week is just after the first week ends. And loop again.
        }

        //Here week numbers are pushed based on the month and all the start and and dates of the weeks are pushed also.
        const newWeekNumbers = weeksInMonth.map((week, i) => {
            const weekNumber = moment(week.start).isoWeek()
            return {
                weeks: weekNumber,
                weekStarts: week.start,
                weekEnds: week.end,
                numberOfTasks: 0
            }
        })
        //passs newWeekNumbers to getTasks
        getTasks(newWeekNumbers)
    }

    //When monthNumber is changed, monthName is changed to reflect the monthNumber.
    useEffect(() => {
        if (monthNumber == 1) {
            setMonthName('January')
            getWeeks(monthNumber)
        } else if (monthNumber == 2) {
            setMonthName('February')
            getWeeks(monthNumber)
        } else if (monthNumber == 3) {
            setMonthName('March')
            getWeeks(monthNumber)
        } else if (monthNumber == 4) {
            setMonthName('April')
            getWeeks(monthNumber)
        } else if (monthNumber == 5) {
            setMonthName('May')
            getWeeks(monthNumber)
        } else if (monthNumber == 6) {
            setMonthName('June')
            getWeeks(monthNumber)
        } else if (monthNumber == 7) {
            setMonthName('July')
            getWeeks(monthNumber)
        } else if (monthNumber == 8) {
            setMonthName('August')
            getWeeks(monthNumber)
        } else if (monthNumber == 9) {
            setMonthName('Sebtember')
            getWeeks(monthNumber)
        } else if (monthNumber == 10) {
            setMonthName('Oktober')
            getWeeks(monthNumber)
        } else if (monthNumber == 11) {
            setMonthName('November')
            getWeeks(monthNumber)
        } else if (monthNumber == 12) {
            setMonthName('December')
            getWeeks(monthNumber)
        }
    }, [monthNumber]);

    // Functions to decrease or increase the monthNumber.
    const decreaseMonth = () => {
        if (monthNumber > 1) { setMonthNumber((prevMonthNumber) => prevMonthNumber - 1) }
    }

    const increaseMonth = () => {
        if (monthNumber < 12) { setMonthNumber((prevMonthNumber) => prevMonthNumber + 1) }
    }

    //When weekCard is pressed navigate to corresponding weeklyScreen
    const navigateToWeekly = (weeks) => {
        navigation.navigate('Weekly', {weekNumber: weeks});
        console.log('navigate to week number', weeks);
    };

    return (
        <View
            style={styles.container}>
            <ScrollView>

                <StatusBar style={{ backgroundColor: bgColorLight }} />
                <Text style={{ marginTop: 5, marginLeft: 5 }}>2024</Text>

                <Text style={styles.header}>
                    <Icon
                        name='keyboard-arrow-left'
                        size={40}
                        color={navbarColorLight}

                        onPress={decreaseMonth}
                    />
                    <Text style={{ fontWeight: 'bold', }}>{monthName}</Text>

                    <Icon
                        name='keyboard-arrow-right'
                        size={40}
                        color={navbarColorLight}

                        onPress={increaseMonth}
                    />
                </Text>

                {/* count total number of tasks per month */}
                <Text>This month you have {weekNumbers.reduce((total, w) => total + w.numberOfTasks, 0)} tasks</Text>
                {/* map through weekNumbers and display weeks of each month and the tasks in the month. Also each card has navigation to corresponding Weekly.js screen */}
                {weekNumbers.map((w, i) => {
                    return (
                        <TouchableOpacity key={i} onPress={() => navigateToWeekly(w.weeks)}>
                            <Card containerStyle={styles.weeksCards}>
                                <Text style={{ fontSize: 45, fontWeight: 'bold', backgroundColor: 'transparent' }}>week {w.weeks}</Text>
                                <Text>This week you have {w.numberOfTasks} tasks</Text>
                            </Card>
                        </TouchableOpacity>
                    )
                })}
                <CreateTaskButton />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: bgColorLight,
    },
    header: {
        alignSelf: 'flex-end',
        marginRight: 25,
        marginTop: 65,
        marginBottom: 35,
        fontWeight: 'bold',
        fontSize: 45,
    },
    weeksCards: {
        backgroundColor: cardColorLight,
        borderWidth: 0,
        shadowColor: 'black',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,

    }

})

export default Monthly;