import {ThemeSwitcherProvider} from 'react-css-theme-switcher';
import {useRecoilValue} from 'recoil';
import {ThemeAtom} from '../recoil/theme.atom';
import React from 'react';
import {ConfigProvider, theme, Button, Card, notification} from "antd";
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
                colorBgContainer: '#fff',
                colorPrimary: '#4096ff'
            }
        }
        
        return {
            colorBgContainer: '#303030',
            colorBgElevated: '#303030',
            colorBorder: '#6f6c6c',
            colorBorderSecondary: '#424242',
            colorPrimary: '#4096ff',
            
            // colorInfo: '#3e97e0',
            // colorInfoBg: '#2D363F',
            // colorInfoBorder: '#344f65',
            //
            // colorSuccess: '#4dae1d',
            // colorSuccessBg: '#2e3b29',
            // colorSuccessBorder: '#3a5c29',
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
