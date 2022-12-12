import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'antd/dist/antd.css';
import {RecoilRoot} from 'recoil';
import Router from './core/Router';
import Header from './ui/component/Header';
import ThemeProvider from './core/ThemeProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <RecoilRoot>
      <ThemeProvider>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Header />
          <Router />
        </div>
      </ThemeProvider>
    </RecoilRoot>
  // </React.StrictMode>
)
