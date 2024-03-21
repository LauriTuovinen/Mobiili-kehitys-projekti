import * as React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home'
import Monthly from '../screens/Monthly'
import Weekly from '../screens/Weekly' 
import Ionicons from 'react-native-vector-icons/Ionicons';

const homeScreen = 'Home';
const weeklyScreen = 'Weekly';
const monthlyScreen = 'Monthly';

const Tab = createBottomTabNavigator();
 
export default function Navigation() {
    return(
        <NavigationContainer style={styles.container}>
            <Tab.Navigator 
            initialRouteName={homeScreen}
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === homeScreen){
                        iconName = focused ? 'home' : 'home-outline'
                    } else if (rn === weeklyScreen) {
                        iconName = focused ? 'list' : 'list-outline'
                    } else if (rn === monthlyScreen) {
                        iconName = focused ? 'settings' : 'settings-outline'
                    }
                    return <Ionicons name={iconName} size={size} color={color}/>
                },

            })}
            
            tabBarOptions={{
                activeTintColor: 'black',
                inactiveTintColor: 'grey',
                labelStyle: { paddingBottom: 10, fontSize: 10 },
                style: { padding: 10, height: 70},
                navigationBarColor: 'gold'
              }}>

                <Tab.Screen style={styles.container} name = {homeScreen} component={Home}/>
                <Tab.Screen name = {weeklyScreen} component={Weekly}/>
                <Tab.Screen name = {monthlyScreen} component={Monthly}/>

            </Tab.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9efdb',
        alignItems: 'center',
        justifyContent: 'center',
    },

    NavContainer: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 20,
    },

    NavBar: {
        flexDirection: 'row',
        backgroundColor: '#ffb8b1',
        width:'100%',
        justifyContent: 'space-evenly',
    },
  });

