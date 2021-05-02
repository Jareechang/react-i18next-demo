import * as Express from 'express'
import http from 'http'
// @ts-ignore
import httpProxy from 'http-proxy'
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

import App from 'client/src/App'

const app : Express.Application = express()
const port : number = 3001

const clientServer = {
    socket: `ws://localhost:3000`,
    http: `http://localhost:3000`,
}

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)
const appSrc = resolveApp('src')


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


const server = http.createServer(app)

// Create-react-app dev server
const craDevServer : any = httpProxy.createServer({
    target: clientServer.socket,
    ws: true
})

app.use(i18nextMiddleware.handle(i18n))

// Proxy all /assets/* to create-react-app dev server
app.use([
    '/assets',
    /.+hot-update\.json/
], (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
) => {
    craDevServer.web(req, res, {})
})

// upgrade the socket connection in create-react-app 
server.on('upgrade', (
    req: Express.Request,
    socket: any,
    head: any 
) => {
    craDevServer.ws(req, socket, head)
})

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '../src/views'))
app.use('/locales', express.static(`${appSrc}/locales`))

app.get('*', (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
) => {
    const context = { url: '' }
    const initialLanguage : string = req.i18n.language;
    const initialI18nStore = {};
    req.i18n.languages.forEach(l => {
        initialI18nStore[l] = req.i18n.services.resourceStore.data[l];
    });
    const markup = (
        ReactDOM.renderToString(
            <I18nextProvider i18n={req.i18n}>
                <StaticRouter location={req.url} context={context}>
                    <App />
                </StaticRouter>
            </I18nextProvider>
        )
    )
    if (context?.url) {
        res.redirect(context?.url)
    } else {
        res.render('index.pug', {
            publicUrl: clientServer.http,
            markup,
            initialLanguage,
            initialI18nStore
        })
    }
});

server.listen(port, () => console.log(`running api on port ${port}!`));
