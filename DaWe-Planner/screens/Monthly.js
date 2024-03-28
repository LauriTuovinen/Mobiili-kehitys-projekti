import { Card, Icon, Text } from "@rneui/themed";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

const bgColorLight = '#f9efdb'
const cardColorLight = '#ffdac1'
const navbarColorLight = '#ffb8b1'

function Monthly() {
    var date = new Date().getDate('')
    var month = new Date().getMonth() + 1
    var year = new Date().getFullYear()
    const [monthNumber, setMonthNumber] = useState(parseInt(month));
    const [monthName, setMonthName] = useState('');

    useEffect(() => {
        if (monthNumber == 1) {
            setMonthName('January')
        } else if (monthNumber == 2) {
            setMonthName('February')
        } else if (monthNumber == 3) {
            setMonthName('March')
        } else if (monthNumber == 4) {
            setMonthName('April')
        } else if (monthNumber == 5) {
            setMonthName('May')
        } else if (monthNumber == 6) {
            setMonthName('June')
        } else if (monthNumber == 7) {
            setMonthName('July')
        } else if (monthNumber == 8) {
            setMonthName('August')
        } else if (monthNumber == 9) {
            setMonthName('Sebtember')
        } else if (monthNumber == 10) {
            setMonthName('Oktober')
        } else if (monthNumber == 11) {
            setMonthName('November')
        } else setMonthName('December')
    }, [monthNumber]);

    // var dateMoment = moment().utcOffset('+02:00').format('MMMM')

    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                <Icon
                    name='keyboard-arrow-left'
                    size={40}
                    color={navbarColorLight}
                    onPress={() => setMonthNumber(monthNumber => monthNumber - 1)}
                />
                {monthName}
                <Icon
                    name='keyboard-arrow-right'
                    size={40}
                    color={navbarColorLight}
                    onPress={() => setMonthNumber(monthNumber => monthNumber + 1)}
                />
            </Text>
            <Card>
                
            </Card>
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
        marginTop: 70,
        fontWeight: 'bold',
        fontSize: 40,
        justifyContent: 'center',

    },
})

export default Monthly;