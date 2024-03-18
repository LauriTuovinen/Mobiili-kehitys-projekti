import { View } from "react-native";
import { Button } from "react-native";

export default function CreateTaskButton(){
    const pressHandler = () => {
        
    }

    return(
        <View>
            <Button title="Add Task" onPress={pressHandler}/>
        </View>
    )


} 