import { View, Text, Button } from "react-native";
import database from "../components/database";
import { dropTaskTable, dropTable, createDB } from "../components/database";

const db = database.db;


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



export default function Settings(){
    return(
       <View>
        <Text>Settings</Text>
        <Button title="Delete Database" onPress={deleteDatabase}></Button>

        <Button title="Delete Table" onPress={deleteTable}></Button>

        <Button title="Get by id" onPress={getTaskByID}></Button>

       </View>
    )
}