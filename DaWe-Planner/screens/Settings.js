import { View, Text, Button } from "react-native";
import database from "../components/database";
import { dropTaskTable } from "../components/database";

const db = database.db;

const deleteDatabase = () => {
    dropTaskTable(db);
}

export default function Settings(){
    return(
       <View>
        <Text>Settings</Text>
        <Button title="Delete Database" onPress={deleteDatabase}></Button>
       </View>
    )
}