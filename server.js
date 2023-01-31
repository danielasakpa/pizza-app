const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');
const ws = require('ws')
const bodyParser = require('body-parser');
const Order = require('./models/Order.js');
const Product = require('./models/Product.js');
var cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
    const exp = express()
    exp.use(cors({
        origin: process.env.API_ENDPOINT
    }))

    exp.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", process.env.API_ENDPOINT);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    exp.use('/ws', createProxyMiddleware({ target: `ws://localhost:${PORT}`, ws: true }))

    const server = require('http').Server(exp);
    const wss = new ws.Server({ noServer: true });

    wss.on('connection', (ws) => {
        console.log("A user has connected")
    });


    Product.watch().on('change', (data) => {
        wss.clients.forEach((client) => {
            client.send(JSON.stringify({ type: "product-update", data }));
        });
    });

    Order.watch().on('change', (data) => {
        wss.clients.forEach((client) => {
            client.send(JSON.stringify({ type: "order-update", data }));
        });
    });

    exp.all('*', (req, res) => {
        return handle(req, res);
    });

    server.on('upgrade', (req, socket, head) => {
        console.log("upgrade", req.url)

        if (!req.url.includes('/_next/webpack-hmr')) {
            wss.handleUpgrade(req, socket, head, (ws) => {
                wss.emit('connection', ws, req);
            });
        }
    });

    server.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`> Ready on ${process.env.API_ENDPOINT}:${PORT}`);
    });
}).catch((err) => {
    console.error(err.stack);
    process.exit(1);
});
