import { createContext, useState } from "react";

const FrontEndErrorContext = createContext({});

export const FrontEndErrorProvider = ({ children }) => {
    const [ frontEndErrors, setFrontEndErrors ] = useState({});

    return (
        <FrontEndErrorContext.Provider value={{ frontEndErrors, setFrontEndErrors }}>
            { children }
        </FrontEndErrorContext.Provider>
    );
}

export default FrontEndErrorContext;