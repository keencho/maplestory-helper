import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'antd/dist/antd.css';
import {RecoilRoot} from 'recoil';
import Router from './core/Router';
import ThemeProvider from './core/ThemeProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <RecoilRoot>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </RecoilRoot>
  // </React.StrictMode>
)
