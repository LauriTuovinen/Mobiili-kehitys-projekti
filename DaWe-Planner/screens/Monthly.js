import { Card, Icon, Text } from "@rneui/themed";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Touchable, TouchableOpacity, View } from "react-native";
import CreateTaskButton from "../components/CreateTaskButton";
import 'moment/locale/en-gb'
import { useNavigation } from "@react-navigation/native";
const bgColorLight = '#f9efdb'
const cardColorLight = '#ffdac1'
const navbarColorLight = '#ffb8b1'

var moment = require('moment');

function Monthly() {
    var month = new Date().getMonth() + 1
    const [monthName, setMonthName] = useState('');
    const [monthNumber, setMonthNumber] = useState(month);
    const [weekNumbers, setWeekNumbers] = useState([]);

    function getWeeks(month) {
        //Get how many weeks has passed from the start of the year to the start of the selected month 
        var startOfYear = moment().startOf('year');
        var startOfGivenMonth = moment().month(month).startOf('month');
        var daysDifference = startOfGivenMonth.diff(startOfYear, 'days');
        var weeksDifference = Math.floor(daysDifference / 7);

        const forWeeks = weeksDifference - 3
        const newWeekNumbers = []
        //Push weeks of the current month to weekNumbers
        for (i = forWeeks; i <= weeksDifference + 1; i++) {
            if (i < 53)
                newWeekNumbers.push({
                    weeks: i
                })
        }
        setWeekNumbers(newWeekNumbers)
        console.log(weekNumbers);
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

    const navigation = useNavigation();
    //When weekCard is pressed navigate to corresponding weeklyScreen
    const navigateToWeekly = (weeks) => {
        navigation.navigate('Weekly');
        console.log('navigate to week number', weeks);
    };

    return (
        <View style={styles.container}>
            <Text style={{ marginTop: 5, marginLeft: 5 }}>2024</Text>

            <Text style={styles.header}>
                <Icon
                    name='keyboard-arrow-left'
                    size={40}
                    color={navbarColorLight}

                    onPress={decreaseMonth}
                // backgroundColor={'red'}
                />
                <Text style={{ fontWeight: 'bold', }}>{monthName}</Text>

                <Icon
                    name='keyboard-arrow-right'
                    size={40}
                    color={navbarColorLight}

                    onPress={increaseMonth}
                // backgroundColor={'red'}
                />
            </Text>
            {weekNumbers.map((w, i) => {
                return (
                    <TouchableOpacity key={i} onPress={() => navigateToWeekly(w.weeks)}>
                        <Card containerStyle={styles.weeksCards}>
                            <Text style={{ fontSize: 45, fontWeight: 'bold', backgroundColor: 'transparent' }}>week {w.weeks}</Text>
                            <Text>This week you have {i} tasks</Text>
                        </Card>
                    </TouchableOpacity>
                )
            })}

            <CreateTaskButton />
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