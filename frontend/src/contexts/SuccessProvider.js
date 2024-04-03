import { createContext, useState } from "react";

const SuccessContext = createContext({});

export const SuccessProvider = ({ children }) => {
    const [ successMessages, setSuccessMessages ] = useState({});

    return (
        <SuccessContext.Provider value={{ successMessages, setSuccessMessages }}>
            { children }
        </SuccessContext.Provider>
    );
}

export default SuccessContext;