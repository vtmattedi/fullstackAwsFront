import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AlertInfo {
    title: string;
    text: string;
    onClose?: () => void;
}


interface GlobalContextProps {
    addAlert: (alert: AlertInfo) => void;
    closeAlert: () => void;
    getCurrentAlert: () => AlertInfo | null;
    loadingText: string | null;
    setLoadingText: (text: string) => void;
    setShowLoading: (show: boolean) => void;
    showLoading: boolean;
    showAlert: boolean;
    setShowAlert: (show: boolean) => void;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loadingText, setLoadingText] = useState<string | null>(null);
    const [alertStack, setAlertStack] = useState<AlertInfo[]>([]);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);

   
    const getCurrentAlert = () => {
        return alertStack.length > 0 ? alertStack[alertStack.length - 1] : null;
    }
    const pushAlertToStack = (alert: AlertInfo) => {
        setAlertStack((prevStack) => [...prevStack, alert]);
    };

    const popAlertFromStack = () => {
        setAlertStack((prevStack) => prevStack.slice(0, -1));
    };

    const addAlert = ({ title, text, onClose }: AlertInfo) => {
        pushAlertToStack({ title, text, onClose });
    }

    const closeAlert = () => {
        const alert = getCurrentAlert();
        if (alert) {
            alert.onClose?.();
            setTimeout(() => {
            popAlertFromStack()}, 100);
        }
    }

    useEffect(() => {
        if (alertStack.length > 0) {
            setShowAlert(true);
        }
        else {
            setShowAlert(false);
        }
    }, [alertStack]);

    return (
        <GlobalContext.Provider value={{addAlert,  closeAlert, getCurrentAlert, loadingText, setLoadingText,setShowLoading, showLoading, showAlert, setShowAlert }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = (): GlobalContextProps => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within a GlobalProvider');
    }
    return context;
};