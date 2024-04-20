import { Card, Icon, Text } from "@rneui/themed";
import { useContext, useEffect, useState } from "react";
import { Pressable, ScrollView, StatusBar, StyleSheet, Touchable, TouchableOpacity, View } from "react-native";
import CreateTaskButton from "../components/CreateTaskButton";
import 'moment/locale/en-gb'
import { useNavigation } from "@react-navigation/native";
import database from "../components/database";
import { DarkModeContext, DarkModeProvider } from '../components/themeContext'


const bgColorLight = '#f9efdb'
const cardColorLight = '#ffdac1'
const navbarColorLight = '#ffb8b1'
const cardColorDark = '#979797'
const navbarColorDark = '#b95970'
const bgColorDark = '#757575'

var moment = require('moment');
const db = database.db;

function Monthly() {
    const { darkMode } = useContext(DarkModeContext)
    var month = moment().month() + 1
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
            setMonthName('September')
            getWeeks(monthNumber)
        } else if (monthNumber == 10) {
            setMonthName('October')
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
        navigation.navigate('Weekly', { weekNumber: weeks });
        console.log('navigate to week number', weeks);
        console.log(moment().month() + 1);
    };

    return (
        <View>
            <ScrollView>
            <View style={darkMode ? styles.darkContainer : styles.container}>

                <StatusBar style={{ backgroundColor: darkMode ? navbarColorDark : navbarColorLight }} />
                <Text style={{ marginTop: 5, marginLeft: 15, fontWeight: 'bold' }}>2024</Text>

                <Text style={styles.header}>
                    <Icon
                        name='keyboard-arrow-left'
                        size={40}
                        color={darkMode ? navbarColorDark : navbarColorLight}

                        onPress={decreaseMonth}
                    />
                    <Text style={{ fontWeight: 'bold', }}>{monthName}</Text>

                    <Icon
                        name='keyboard-arrow-right'
                        size={40}
                        color={darkMode ? navbarColorDark : navbarColorLight}

                        onPress={increaseMonth}
                    />
                </Text>

                {/* count total number of tasks per month */}
                <Text style={{ marginLeft: 15, fontWeight: 'bold' }}>This month you have {weekNumbers.reduce((total, w) => total + w.numberOfTasks, 0)} tasks</Text>
                {/* map through weekNumbers and display weeks of each month and the tasks in the month. Also each card has navigation to corresponding Weekly.js screen */}
                {weekNumbers.map((w, i) => {
                    return (
                        <TouchableOpacity key={i} onPress={() => navigateToWeekly(w.weeks)}>
                            <Card containerStyle={darkMode ? styles.darkWeeksCards : styles.weeksCards}>
                                <View style={{ flexDirection: 'row', justifyContent: "space-evenly", alignItems: 'center' }}>
                                    <Text style={{ fontSize: 45, fontWeight: 'bold', backgroundColor: 'transparent' }}>week {w.weeks}</Text>
                                    <Text style={{ fontWeight: 'bold' }}>{w.numberOfTasks} tasks this week</Text>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    )
                })}        
                </View>
            </ScrollView>
            <CreateTaskButton />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: bgColorLight,
    },
    darkContainer: {
        flex: 1,
        backgroundColor: bgColorDark,
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
        borderRadius: 5,


    },
    darkWeeksCards: {
        backgroundColor: cardColorDark,
        borderWidth: 0,
        shadowColor: 'black',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
        borderRadius: 5,


    }

})

export default Monthly;