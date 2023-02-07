import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'antd/dist/antd.css';
import {RecoilRoot} from 'recoil';
import Router from './core/Router';
import ThemeProvider from './core/ThemeProvider';
import {Analytics} from '@vercel/analytics/react';
import RecoilNexus from './recoil/recoil.nexus';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <RecoilRoot>
      <RecoilNexus />
      <ThemeProvider>
        <Router />
        <Analytics />
      </ThemeProvider>
    </RecoilRoot>
  // </React.StrictMode>
)
