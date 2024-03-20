import * as React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home'
import Monthly from '../screens/Monthly'
import Weekly from '../screens/Weekly' 
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeScreen = 'Home';
const WeeklyScreen = 'Weekly';
const MonthlyScreen = 'Monthly';

const Tab = createBottomTabNavigator();
 
export default function Navigation() {
    return(
        <NavigationContainer style={styles.container}>
            <Tab.Navigator
            initialRouteName={HomeScreen}
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === HomeScreen){
                        iconName = focused ? 'home' : 'home-outline'
                    } else if (rn === WeeklyScreen) {
                        iconName = focused ? 'list' : 'list-outline'
                    } else if (rn === MonthlyScreen) {
                        iconName = focused ? 'settings' : 'settings-outline'
                    }
                    return <Ionicons name={iconName} size={size} color={color}/>
                },

            })}
            
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'grey',
                labelStyle: { paddingBottom: 10, fontSize: 10 },
                style: { padding: 10, height: 70}
              }}>

                <Tab.Screen name = {HomeScreen} component={Home}/>
                <Tab.Screen name = {WeeklyScreen} component={Weekly}/>
                <Tab.Screen name = {MonthlyScreen} component={Monthly}/>

                
            </Tab.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#ffb8b1'
    }
  });

