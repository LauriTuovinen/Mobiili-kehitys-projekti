import { createContext, useState } from "react";
import { Button } from "react-native";

export const DarkModeContext = createContext()

export function DarkModeProvider(props) {
    const [darkMode, setDarkMode] = useState(false)

    const toggleDarkMode = (theme) => {
        if (theme === 2){
            setDarkMode(true)
        } else if (theme === 1) {
            setDarkMode(false)
        }
        console.log('Darkmode on:', darkMode);
    }

    return ( 
            <DarkModeContext.Provider value = {{darkMode, toggleDarkMode}}>
            {props.children}
            </DarkModeContext.Provider>
     );

    }
    
