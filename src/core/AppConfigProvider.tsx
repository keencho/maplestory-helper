import {ThemeSwitcherProvider} from 'react-css-theme-switcher';
import {useRecoilValue} from 'recoil';
import {ThemeAtom} from '../recoil/theme.atom';
import React from 'react';
import { ConfigProvider, theme, Button, Card } from "antd";
import {AliasToken} from "antd/es/theme/interface";

interface Props {
	children: React.ReactNode;
}

const { defaultAlgorithm, darkAlgorithm } = theme;

const AppConfigProvider: React.FC<Props> = ({ children }) => {
	
	const theme = useRecoilValue(ThemeAtom);
    
    const getThemeToken = (): Partial<AliasToken> => {
        if (theme === 'light') {
            return {
                colorBgContainer: '#fff'
            }
        }
        
        return {
            colorBgContainer: '#303030',
            colorBgElevated: '#303030',
            colorBorder: '#6f6c6c',
            colorBorderSecondary: '#424242'
        }
    }
	
	return (
        <ConfigProvider
            theme={{
                algorithm: theme === 'light' ? defaultAlgorithm : darkAlgorithm,
                token: getThemeToken(),
                components: {
                
                }
            }}
        >
            {children}
        </ConfigProvider>
	)
}

export default AppConfigProvider
