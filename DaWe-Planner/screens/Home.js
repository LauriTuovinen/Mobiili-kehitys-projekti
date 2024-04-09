import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, Image } from '@rneui/themed';
import hyi from '../assets/hyi.jpg'
import database from "../components/database";

const bgColorLight = '#f9efdb'
const cardColorLight = '#ffdac1'
const navbarColorLight = '#ffb8b1'

var moment = require('moment');
const db = database.db;

function Home({ day }) {
    const [tasks, setTasks] = useState([]);
    const correctDay = day ? moment(day) : moment()
    const formattedDay = moment(correctDay).format('DD/MM/YYYY')
    useEffect(() => {

        const fetchData = async () => {
            // dropTaskTable(db)
            const taskData = await database.getAllTasks(db) //get tasks

            const newTasks = taskData._array.filter(task => {
                const taskDate = moment(task.date, 'DD/MM/YYYY')
                return taskDate.isSame(correctDay, 'day')
            })

            setTasks(newTasks)
        }
        fetchData()
    }, [])


    const [OpenPhoto, setOpenPhoto] = useState(false);

    //Created a button function to get more control over the style
    function OwnButton(props) {
        const { onPress, title = 'Save' } = props;
        return (
            <Pressable style={styles.button} onPress={onPress}>
                <Text style={styles.text}>{title}</Text>
            </Pressable>
        )
    }
    //Open the thumbnail picture larger in a modal.
    function PhotoModal({ ImageSource }) {
        return (
            <Modal visible={OpenPhoto === true}
                transparent={true}
                animationType='fade'
                onRequestClose={() => setOpenPhoto(false)}
            >
                <View style={styles.imageModal}>
                    <View style={styles.viewModal}
                    >
                        <Image
                            source={ImageSource}
                            style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
                        />
                        <OwnButton title="close" onPress={handleClosePhoto} color={navbarColorLight} />
                    </View>
                </View>
            </Modal>
        )
    }

    //functions to open and close the photomodal.
    const handleClosePhoto = () => {
        setOpenPhoto(false)
        console.log('close photo false');
    }
    const handleOpenPhoto = () => {
        setOpenPhoto(true)
        console.log('open photo true');
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style={{ backgroundColor: bgColorLight }} />
            <ScrollView>
                <Text style={styles.header}>Upcoming tasks</Text>
                <Text style={styles.secondadryHeader}>{formattedDay}</Text>
                <View style={styles.upcomingTaskView}>
                    {tasks.map((t, i) => {
                        return (
                            // mapping tasks to cards
                            <Card key={i} containerStyle={styles.upcomingTaskCard}>
                                <Card.Title>{t.name}</Card.Title>
                                <Card.Divider />
                                {/* <Text style={{ paddingLeft: 13, paddingBottom: 5 }}>{t.date}</Text> */}
                                <Text style={{ flex: 1, overflow: 'hidden', paddingLeft: 13 }}>starting at {t.startTime}</Text>
                                <Text style={{ flex: 1, overflow: 'hidden', paddingLeft: 13 }}>ends at {t.endTime}</Text>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Image
                                        source={hyi}
                                        style={styles.image}
                                        onPress={handleOpenPhoto}
                                    />
                                    <Text style={{ flex: 1, overflow: 'hidden' }}>{t.description}</Text>
                                    <Text style={{ flex: 1, overflow: 'hidden' }}>{t.notification}</Text>
                                    <Text style={{ flex: 1, overflow: 'hidden' }}>{t.priority}</Text>
                                </View>
                                {/* if OpenPhoto is true or false show PhotoModal */}
                                {OpenPhoto ? <PhotoModal ImageSource={hyi} /> :
                                    <View></View>
                                }
                            </Card>
                        )
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


//styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: bgColorLight,
        width: '100%',
    },
    header: {
        alignSelf: 'flex-end',
        marginRight: 25,
        marginTop: 70,
        fontWeight: 'bold',
        fontSize: 40,
    },
    secondadryHeader: {
        alignSelf: 'flex-start',
        marginLeft: 55,
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 20,
    },
    upcomingTaskView: {
        width: '85%',
        alignSelf: 'center',
        marginTop: 20,
    },
    upcomingTaskCard: {
        backgroundColor: cardColorLight,
        borderWidth: 0,
        shadowColor: 'black',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 10,
    },
    image: {
        height: 100,
        width: 100,
        resizeMode: 'contain',
        marginTop: 5,

    },
    imageModal: {
        flex: 1,
        flexDirection: 'column',
        height: '90%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewModal: {
        width: '70%',
        height: '70%',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        justifySelf: 'flex-start',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: navbarColorLight,
    },
});




export default Home;