import { View, Text, StyleSheet, Button, Pressable, Modal, TouchableOpacity } from "react-native";
import database from "../components/database";
import { dropTaskTable, dropTable, createDB } from "../components/database";
import { DarkModeContext } from "../components/themeContext";
import { useContext, useEffect, useState } from "react";
import SwitchSelector from "react-native-switch-selector";
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = database.db;
const bgColorLight = '#f9efdb'
const cardColorLight = '#ffdac1'
const navbarColorLight = '#ffb8b1'
const cardColorDark = '#979797'
const navbarColorDark = '#b95970'
const bgColorDark = '#757575'

//Deletes database
const deleteDatabase = () => {
    dropTaskTable(db);
}

//Deletes table and creates it again
const deleteTable = async () => {
    dropTable(db);
    createDB(db);

}

const getTaskByID = async () => {
    const task = await database.getTaskbyId(db, 5)
    console.log("Task by id 5: ", task)
}
//Switches from darkmode to light mode.
function DarkModeSwitch() {
    const [theme, setTheme] = useState('');
    const { toggleDarkMode } = useContext(DarkModeContext)
    const [initialValue, setInitialValue] = useState();

    //Get theme from async storage(localstorage) and set theme. 
    //Also change the initial value of SwitchSelector to that theme.
    useEffect(() => {
        const getTheme = async () => {
            try {
                const gettedTheme = await AsyncStorage.getItem('theme')
                console.log('theme:', gettedTheme);
                setTheme(gettedTheme)
                if (gettedTheme === 1) {
                    setInitialValue(0)
                } else if (gettedTheme === 2) {
                    setInitialValue(1)
                } else {
                    setInitialValue(1)
                }
            } catch (e) {
                console.log('Error getting theme');
            }
        }
        getTheme()
    }, []);
    //Change theme based on switch state, save theme value to async storage (local storage).
    useEffect(() => {
        toggleDarkMode(theme)
        const saveTheme = () => {
            AsyncStorage.setItem('theme', theme)
        }
        saveTheme()
    }, [theme]);

    //Change SwitchSelector colors based on theme.
    let textColor, selectedColor, buttonColor, borderColor;
    if (theme === '1') {
        textColor = navbarColorLight;
        selectedColor = navbarColorDark;
        buttonColor = navbarColorLight;
        borderColor = bgColorLight;
    } else if (theme === '2') {
        textColor = navbarColorDark;
        selectedColor = navbarColorLight;
        buttonColor = navbarColorDark;
        borderColor = bgColorDark;
    }
    return (
        <View>
            <SwitchSelector
                initial={initialValue}
                onPress={(value) => setTheme(value)}
                textColor={textColor}
                selectedColor={selectedColor}
                buttonColor={buttonColor}
                borderColor={borderColor}
                hasPadding
                options={[
                    { label: "Light", value: '1' },
                    { label: "Dark", value: '2' }
                ]}
                testID="theme-switch-selector"
                accessibilityLabel="theme-switch-selector"
            />
        </View>
    )
}

export default function Settings() {
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext)
    const [openDelete, setOpenDelete] = useState(false);
    const [openuserDelete, setOpenUserDelete] = useState(false)

    const toggleDeleteModal = () => {
        setOpenDelete(!openDelete);
    };

    const deleteAndClose = () => {
        setOpenDelete(!openDelete);
        deleteTable();
    }    
    
    const toggleDeleteUserInfoModal = () => {
        setOpenUserDelete(!openuserDelete);
    };

    const deleteAndCloseUser = () => {
        setOpenUserDelete(!openuserDelete);
        deleteDatabase();
    }

    return (
        <View style={darkMode ? styles.DarkContainer : styles.container}>
            <View style={styles.buttonContainer}>

                <Button color={darkMode ? navbarColorDark : navbarColorLight} title="Clear user info" onPress={toggleDeleteUserInfoModal}></Button>

                <Button color={darkMode ? navbarColorDark : navbarColorLight} title="Clear all tasks" onPress={toggleDeleteModal}></Button>

                {/* <Button color={darkMode ? navbarColorDark : navbarColorLight} title="Get by id" onPress={getTaskByID}></Button> */}
            </View>
            <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold', marginTop: 40, marginBottom: 15 }}>Select Theme</Text>
            <DarkModeSwitch />

            <Modal visible={openDelete} animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>
                        <View style={darkMode ? styles.DarkdeleteModal : styles.deleteModal}>
                            <Text style={styles.font}> Are you sure you want to delete all tasks?</Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'center'}}>
                            <TouchableOpacity style={darkMode ? styles.Darkbutton : styles.button} onPress={toggleDeleteModal}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>                            
                            <TouchableOpacity style={ darkMode ? styles.Darkbutton : styles.button} onPress={deleteAndClose}>
                                <Text style={styles.buttonText}>delete</Text>
                            </TouchableOpacity>                                
                            </View>
                        </View>
                    </View>
            </Modal>

            <Modal visible={openuserDelete} animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>
                        <View style={darkMode ? styles.DarkdeleteModal : styles.deleteModal}>
                            <Text style={styles.font}> Are you sure you want to delete all user information?</Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'center'}}>
                            <TouchableOpacity style={darkMode ? styles.Darkbutton : styles.button} onPress={toggleDeleteUserInfoModal}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>                            
                            <TouchableOpacity style={ darkMode ? styles.Darkbutton : styles.button} onPress={deleteAndCloseUser}>
                                <Text style={styles.buttonText}>delete</Text>
                            </TouchableOpacity>                                
                            </View>
                        </View>
                    </View>
            </Modal>
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
        justifyContent: 'space-evenly'
    },
    deleteModal: {
        height: '20%',
        backgroundColor: cardColorLight
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    button: {
        width: 100,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: navbarColorLight,
        paddingTop: 16,
        paddingBottom: 16,
        margin: 8,
        alignItems: 'center',
    },
    font: {
        fontSize: 16,
        fontWeight: "bold",
        color: 'black',
        margin: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: 'black',
    },

    DarkdeleteModal: {
        height: '20%',
        backgroundColor: cardColorDark
    },
    Darkbutton: {
        width: 100,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: navbarColorDark,
        paddingTop: 16,
        paddingBottom: 16,
        margin: 8,
        alignItems: 'center',
    },
})