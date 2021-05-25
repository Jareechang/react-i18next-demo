import * as Express from 'express'
import { exec } from 'child_process';
import express from 'express'
import path from 'path'
import fs from 'fs'
import ReactDOM from 'react-dom/server'
import React from 'react'
import { StaticRouter } from 'react-router-dom'
import i18n, {
    I18nextProvider
} from '@common/i18n';
import Backend from 'i18next-fs-backend'
import i18nextMiddleware from 'i18next-http-middleware'
import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles'

import App from 'client/src/App'
import theme from 'client/src/theme';

const isProd = process.env.NODE_ENV === 'production';

const appDirectory = fs.realpathSync(process.cwd())
const lambdaRoot : string = process.env.LAMBDA_TASK_ROOT || '';

console.info('lambda Root: ', lambdaRoot);

const resolveApp = relativePath => path.resolve(
    isProd ? lambdaRoot : appDirectory,
    relativePath
);

const appSrc = resolveApp(isProd ? 'dist' : 'src')
exec(`ls ${appSrc}`, (err, stdout, stderr) => {
    console.info(stdout);
});

export const register = (
    app: Express.Application,
    config: any
) : Express.Application => {

    i18n
        .use(Backend)
        .use(i18nextMiddleware.LanguageDetector)
        .init({
            debug: false,
            preload: ['en', 'es'],
            ns: [
                'languages',
                'common',
                'home',
                'news',
                'header:translations'
            ],
            backend: {
                loadPath: (lng, ns) => {
                    if (ns.match(/header:/)) {
                        const headerPkgSrc = resolveApp('../../node_modules/@common/header/src')
                        const resolvedNs : string = ns.split(':')[1];
                        return `${headerPkgSrc}/locales/${lng}/${resolvedNs}.json`
                    }
                    return `${appSrc}/locales/{{lng}}/{{ns}}.json`
                },
                addPath: `${appSrc}/locales/{{lng}}/{{ns}}.missing.json`
            }
        })


    app.use(i18nextMiddleware.handle(i18n))

    app.set('view engine', 'pug')
    app.set('views', path.join(`${appSrc}/views`))
    app.use('/locales', express.static(`${appSrc}/locales`))

    app.get('*', (
        req: Express.Request,
        res: Express.Response,
        next: Express.NextFunction
    ) => {
        const context = { url: '' }
        const initialLanguage : string = req.i18n.language;
        const initialI18nStore = {};
        const sheets = new ServerStyleSheets();
        req.i18n.languages.forEach(l => {
            initialI18nStore[l] = req.i18n.services.resourceStore.data[l];
        });
        const markup = (
            ReactDOM.renderToString(
                sheets.collect(
                    <I18nextProvider i18n={req.i18n}>
                        <StaticRouter location={req.url} context={context}>
                            <ThemeProvider theme={theme}>
                                <App />
                            </ThemeProvider>
                        </StaticRouter>
                    </I18nextProvider>
                )
            )
        )
        if (context?.url) {
            res.redirect(context?.url)
        } else {
            res.set('Cache-Control', 'public, max-age=120');
            res.render('index.pug', {
                publicUrl: config.clientServer.http,
                markup,
                css: sheets.toString(),
                initialLanguage,
                initialI18nStore
            })
        }
    });

    return app;
}
