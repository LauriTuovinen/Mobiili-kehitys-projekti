import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home'
import Monthly from '../screens/Monthly'
import Weekly from '../screens/Weekly' 
import CreateTask from '../screens/CreateTask';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

const homeScreen = 'Home';
const weeklyScreen = 'Weekly';
const monthlyScreen = 'Monthly';
const createTaskScreen = 'Create task';

const Tab = createBottomTabNavigator();
 
export default function Navigation() {
    return(
        <NavigationContainer>
            <Tab.Navigator 
            initialRouteName={homeScreen}
            // initialRouteName={monthlyScreen}
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
                    }
                    return <Ionicons name={iconName} size={size} color={color}/>
                },

            })}
            
            NavBarOptions={{
                activeTintColor: 'black',
                inactiveTintColor: 'grey',
                labelStyle: { backgroundColor:'#ffb8b1', paddingBottom: 10, fontSize: 10 },
              }}>

                <Tab.Screen name = {homeScreen} component={Home}/>
                <Tab.Screen name = {weeklyScreen} component={Weekly}/>
                <Tab.Screen name = {monthlyScreen} component={Monthly}/>
                <Tab.Screen name = {createTaskScreen} component={CreateTask}/>

            </Tab.Navigator>
        </NavigationContainer>
    )
}

