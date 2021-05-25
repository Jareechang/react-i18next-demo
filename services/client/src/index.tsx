import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { useSSR } from '@common/i18n';
import { ThemeProvider } from '@material-ui/core/styles';

import theme from './theme';
import App from './App';
import reportWebVitals from './reportWebVitals';
import history from './history';

import './i18n';
import './liveReload'
import './index.css';

const Base = () => {
    // @ts-ignore
    useSSR(window.initialI18nStore, window.initialLanguage);
    React.useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles?.parentElement?.removeChild(jssStyles);
        }
    }, []);
    return (
        <React.Suspense fallback="loading...">
            <Router history={history}>
                <ThemeProvider theme={theme}>
                    <App />
                </ThemeProvider>
            </Router>
        </React.Suspense>
    );
}

ReactDOM.hydrate(
    <React.StrictMode>
        <Base />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
