import * as Express from 'express'
import http from 'http'
// @ts-ignore
import httpProxy from 'http-proxy'

export const register = (
    app: Express.Application,
    config: any
) : Express.Application => {
    const port : number = config?.port || 3001;
    const server = http.createServer(app)

    // Create-react-app dev server
    const craDevServer : any = httpProxy.createServer({
        target: config.clientServer.socket,
        ws: true
    })

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

    server.listen(port || 3001, () => console.log(`running api on port ${port}!`));

    return app;
}
