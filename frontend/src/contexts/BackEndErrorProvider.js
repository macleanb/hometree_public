import { createContext, useState } from "react";

const BackEndErrorContext = createContext({});

export const BackEndErrorProvider = ({ children }) => {
    const [ backEndErrors, setBackEndErrors ] = useState({});

    return (
        <BackEndErrorContext.Provider value={{ backEndErrors, setBackEndErrors }}>
            { children }
        </BackEndErrorContext.Provider>
    );
}

export default BackEndErrorContext;