import {useRecoilValue} from "recoil";
import {ThemeAtom} from "../recoil/theme.atom";
import {useEffect, useState} from "react";

type Config = {
    fill: string,
    tooltip?: object
}

const useRechartsColor = () => {
    
    const light = (): Config => {
        return {
            fill: '#6294F9',
        }
    }
    
    const dark = (): Config => {
        return {
            fill: '#588AEF',
            tooltip: {
                backgroundColor: '#1F1F1F',
                border: 'none',
                fill: '#5F6269'
            }
        }
    }
    
    const theme = useRecoilValue(ThemeAtom);
    const [color, setColor] = useState<Config>(theme === 'light' ? light() : dark())
    
    useEffect(() => {
        setColor(theme === 'light' ? light() : dark())
    }, [theme]);
    
    return color;
}

export default useRechartsColor;
