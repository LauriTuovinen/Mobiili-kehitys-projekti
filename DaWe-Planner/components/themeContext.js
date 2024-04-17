import { createContext, useState } from "react";

//Create context to get darkMode and toggleDarkMode to all screens.
export const DarkModeContext = createContext()

export function DarkModeProvider(props) {
    const [darkMode, setDarkMode] = useState(false)
    //Changes the value of darkMode based on props theme.
    const toggleDarkMode = (theme) => {
        console.log('Trying to change theme');
        if (theme === '2') {
            setDarkMode(true)
        } else if (theme === '1') {
            setDarkMode(false)
        }
        console.log('theme changed, darkmode:', darkMode);
    }

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {props.children}
        </DarkModeContext.Provider>
    );

}

