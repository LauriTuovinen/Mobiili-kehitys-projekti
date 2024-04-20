import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home'
import Monthly from '../screens/Monthly'
import Weekly from '../screens/Weekly'
import CreateTask from '../screens/CreateTask';
import Settings from '../screens/Settings';
import { TaskInfo } from '../screens/TaskInfo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DarkModeContext } from './themeContext';


const homeScreen = 'Home';
const weeklyScreen = 'Weekly';
const monthlyScreen = 'Monthly';
const createTaskScreen = 'Create';
const settingsScreen = 'Settings'
const taskInfoScreen = 'TaskInfo'

const navbarColorLight = '#ffb8b1'
const navbarColorDark = '#b95970'

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export function OGnavigaatio() {
    const { darkMode } = React.useContext(DarkModeContext)

    return (
        <Tab.Navigator
            initialRouteName={homeScreen}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === homeScreen) {
                        iconName = focused ? 'home' : 'home-outline'
                    } else if (rn === weeklyScreen) {
                        iconName = focused ? 'calendar-clear' : 'calendar-clear-outline'
                    } else if (rn === monthlyScreen) {
                        iconName = focused ? 'calendar' : 'calendar-outline'
                    } else if (rn === createTaskScreen) {
                        iconName = focused ? 'add-outline' : 'add-outline'
                    }
                    else if (rn === settingsScreen) {
                        iconName = focused ? 'settings' : 'settings-outline'
                    }

                    return <Ionicons name={iconName} size={size} color={color} />
                },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: '#545454',
                labelStyle: { paddingBottom: 4,fontSize: 10 },
                tabBarStyle: { backgroundColor: darkMode ? navbarColorDark : navbarColorLight },
                headerStyle: { backgroundColor: darkMode ? navbarColorDark : navbarColorLight },
            })}
        >

            <Tab.Screen name={homeScreen} component={Home} goBack='history' />
            <Tab.Screen name={weeklyScreen} component={Weekly} />
            <Tab.Screen name={monthlyScreen} component={Monthly} />
            <Tab.Screen name={settingsScreen} component={Settings} />
        </Tab.Navigator>
    )
}

export default function Navigation() {
    const { darkMode } = React.useContext(DarkModeContext)

    return (
        <NavigationContainer>
            <Stack.Navigator 
            screenOptions={() => ({
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: '#545454',
                labelStyle: { paddingBottom: 4,fontSize: 10 },
                headerStyle: { backgroundColor: darkMode ? navbarColorDark : navbarColorLight },
            })}
            >
                <Stack.Screen
                    name="OGnavigaatio"
                    component={OGnavigaatio}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name={taskInfoScreen} component={TaskInfo} />
                <Stack.Screen name={createTaskScreen} component={CreateTask} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}