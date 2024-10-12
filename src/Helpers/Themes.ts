import { useTheme } from "../Context/MyThemeContext";

const Themed = (className: string) => {
    const {theme} =  useTheme();
    let res = className;
    if (theme === "dark") {
        res += " custom-dark-mode";
    }
    else {
        res = className;
    }
    return res;
}

export default Themed;
