import * as Express from 'express'
import express from 'express'

import * as SSRHandler from './ssr-server'
import * as DevProxyHandler from './dev-server-proxy'

const app : Express.Application = express()
const config = {
    clientServer: {
        socket: `ws://localhost:3000`,
        http: `http://localhost:3000`,
    },
    port: 3001
}

// Add the dev proxy server for proxying requests to CRA dev server in local
if (process.env.NODE_ENV === 'development') {
    DevProxyHandler.register(app, config)
}

// Register ssr handler
SSRHandler.register(app, config)
 
export default app;
