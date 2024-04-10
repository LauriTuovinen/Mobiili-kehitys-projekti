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

export default function Settings(){
    return(
       <View>
        <Text>Settings</Text>
        <Button title="Delete Database" onPress={deleteDatabase}></Button>
        <Button title="Delete Table" onPress={deleteTable}></Button>
       </View>
    )
}