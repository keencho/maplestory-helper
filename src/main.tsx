import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'


import {RecoilRoot} from 'recoil';
import Router from './core/Router';
import AppConfigProvider from './core/AppConfigProvider';
import {Analytics} from '@vercel/analytics/react';
import ResponsiveUIHandler from "./core/ResponsiveUIHandler";
import {App} from "antd";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    // <React.StrictMode>
    <RecoilRoot>
        <AppConfigProvider>
            <App style={{ height: '100%', width: '100%' }}>
                <ResponsiveUIHandler/>
                <Analytics/>
                <Router/>
            </App>
        </AppConfigProvider>
    </RecoilRoot>
    // </React.StrictMode>
)
