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
import { useFocusEffect } from '@react-navigation/native';

const homeScreen = 'Home';
const weeklyScreen = 'Weekly';
const monthlyScreen = 'Monthly';
const createTaskScreen = 'Create';
const settingsScreen = 'Settings'


const Tab = createBottomTabNavigator();
 
export default function Navigation() {
    return(
        <NavigationContainer>
            <Tab.Navigator 
            initialRouteName={homeScreen}
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === homeScreen){
                        iconName = focused ? 'home' : 'home-outline'
                    } else if (rn === weeklyScreen) {
                        iconName = focused ? 'calendar-clear' : 'calendar-clear-outline'
                    } else if (rn === monthlyScreen) {
                        iconName = focused ? 'calendar' : 'calendar-outline'
                    } else if (rn === createTaskScreen) {
                        iconName = focused ? 'add-outline' : 'add-outline'
                    } else if (rn === settingsScreen) {
                        iconName = focused ? 'settings' : 'settings-outline'
                    }
                    
                    return <Ionicons name={iconName} size={size} color={color}/>

                },

            })}
            
            tabBarOptions={{
                activeTintColor: 'black',
                inactiveTintColor: 'grey',
                labelStyle: { paddingBottom: 10, fontSize: 10 },
              }}>

                <Tab.Screen name = {homeScreen} component={Home}/>
                <Tab.Screen name = {weeklyScreen} component={Weekly}/>
                <Tab.Screen name = {monthlyScreen} component={Monthly}/>
                <Tab.Screen name = {createTaskScreen} component={CreateTask}/>
                <Tab.Screen name = {settingsScreen} component={Settings}/>


            </Tab.Navigator>
        </NavigationContainer>
    )
}

