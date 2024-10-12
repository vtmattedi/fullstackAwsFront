import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
type Theme = 'light' | 'dark';

interface ThemeContextProps {
    theme: Theme;
    toggleTheme: (uid: string) => void;
    LoadTheme: (uid: string) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>('light');
    const { userId } = useAuth();
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        SaveTheme();
    };
    const SaveTheme = () => {
        if (!userId)
            return;
        const uid = userId;
        const savedThemes = localStorage.getItem('theme');
        if (savedThemes) {
            localStorage.removeItem('theme');
            try {
                let themeObj = JSON.parse(savedThemes);
                themeObj = themeObj.filter((t: { theme: Theme, userName: string }) => t.userName !== uid);
                themeObj = [...themeObj, { theme: theme, userName: uid }];
                localStorage.setItem('theme', JSON.stringify(themeObj));
            }
            catch (e) {
                let themeObj = [{ theme: theme, userName: uid }];
                localStorage.setItem('theme', JSON.stringify(themeObj));
            }
        }
        else {
            let themeObj = [{ theme: theme, userName: uid }];
            localStorage.setItem('theme', JSON.stringify(themeObj));
        }
    }
    const LoadTheme = () => {
        if (!userId)
            return false;
        const uid = userId;
        try {
            const localThemes = JSON.parse(localStorage.getItem('theme') || "[]") as Array<{ theme: Theme, userName: string }>;
            const userTheme = localThemes.find((t) => t.userName === uid);
            if (userTheme) {
                setTheme(userTheme.theme);
            }
            return true;
        }
        catch (e) {
            console.log(e);
        
            return false;
        }


    }
    useEffect(() => {
        const res = LoadTheme();
        console.log("loading theme: ", res);
    }, [userId]);
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, LoadTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextProps => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};