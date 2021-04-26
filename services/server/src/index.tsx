import * as Express from 'express'
import http from 'http'
// @ts-ignore
import httpProxy from 'http-proxy'
import express from 'express'
import path from 'path'
import ReactDOM from 'react-dom/server'
import React from 'react'
import { StaticRouter } from 'react-router-dom';

import App from 'client/src/App'

const app : Express.Application = express()
const port : number = 3001

const clientServer = {
    socket: `ws://localhost:3000`,
    http: `http://localhost:3000`,
}

const server = http.createServer(app)

// Create-react-app dev server
const craDevServer : any = httpProxy.createServer({
    target: clientServer.socket,
    ws: true
})

// Proxy all /assets/* to create-react-app dev server
app.use([
    '/assets',
    '/locales',
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

app.get('*', (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
) => {
    const context = {}
    const markup = (
        ReactDOM.renderToString(
            <StaticRouter location={req.url} context={context}>
                <App />
            </StaticRouter>
        )
    )
    res.render('index.pug', {
        publicUrl: clientServer.http,
        markup
    })
});

server.listen(port, () => console.log(`running api on port ${port}!`));
