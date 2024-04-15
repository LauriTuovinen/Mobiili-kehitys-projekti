import { View, Text, StyleSheet, Button, Pressable } from "react-native";
import database from "../components/database";
import { dropTaskTable, dropTable, createDB } from "../components/database";
import { DarkModeContext } from "../components/themeContext";
import { useContext, useState } from "react";
import SwitchSelector from "react-native-switch-selector";


const db = database.db;

const bgColorLight = '#f9efdb'
const cardColorLight = '#ffdac1'
const navbarColorLight = '#ffb8b1'
const cardColorDark = '#979797'
const navbarColorDark = '#b95970'
const bgColorDark = '#757575'

const deleteDatabase = () => {
    dropTaskTable(db);
}


const deleteTable = async () => {
    dropTable(db);
    createDB(db);

}

const getTaskByID = async () => {
    const task = await database.getTaskbyId(db, 5)
    console.log("Task by id 5: ", task)
}

function DarkModeSwitch() {
    const [theme, setTheme] = useState(1);
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext)

    if (theme === 1) {
        toggleDarkMode(theme)
    } else if (theme === 2) {
        toggleDarkMode(theme)
    }
    return (<View>
        <SwitchSelector
            initial={1}
            onPress={(value) => setTheme(value)}
            textColor={darkMode ? navbarColorLight : navbarColorDark}
            selectedColor={darkMode ? navbarColorLight : navbarColorDark}
            buttonColor={darkMode ? navbarColorDark : navbarColorLight}
            borderColor={darkMode ? bgColorDark : bgColorLight}
            hasPadding
            options={[
                { label: "Light", value: 1 },
                { label: "Dark", value: 2 }
            ]}
            testID="gender-switch-selector"
            accessibilityLabel="gender-switch-selector"
        />
    </View>
    )
}





export default function Settings() {
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext)
    return (
        <View style={darkMode ? styles.DarkContainer : styles.container}>
            <View style={styles.buttonContainer}>

                <Button color={darkMode ? navbarColorDark : navbarColorLight} title="Delete Database" onPress={deleteDatabase}></Button>

                <Button color={darkMode ? navbarColorDark : navbarColorLight} title="Delete Table" onPress={deleteTable}></Button>

                <Button color={darkMode ? navbarColorDark : navbarColorLight} title="Get by id" onPress={getTaskByID}></Button>
            </View>
                <Text style={{ alignSelf: 'center',fontSize: 20, fontWeight: 'bold', marginTop: 40, marginBottom: 15}}>Select Theme</Text>
            <DarkModeSwitch style={{}} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        alignContent: 'center',
        backgroundColor: bgColorLight,
    },
    DarkContainer: {
        flex: 1,
        paddingTop: 50,
        alignContent: 'center',
        backgroundColor: bgColorDark,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent:'space-evenly'
    },
})