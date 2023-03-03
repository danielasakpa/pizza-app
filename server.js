const express = require('express'); // for handling HTTP requests
const next = require('next'); // for handling Next.js server rendering
const { createProxyMiddleware } = require('http-proxy-middleware'); // for proxying WebSocket connections
const ws = require('ws'); // for creating a WebSocket server
const Order = require('./models/Order.js'); // a MongoDB model for orders
const Product = require('./models/Product.js'); // a MongoDB model for products
var cors = require('cors'); // for handling Cross-Origin Resource Sharing (CORS) headers

// Determine if the app is running in development mode
const dev = process.env.NODE_ENV !== 'production';

// Create a new Next.js app instance
const app = next({ dev });

// Define the port to listen on
const PORT = process.env.PORT || 3000;

// Prepare the Next.js app for use
app.prepare().then(() => {
    // Create a new Express.js app instance
    const exp = express()

    // Enable CORS for the specified API endpoint
    exp.use(cors({
        origin: process.env.API_ENDPOINT
    }))

    // Set the CORS headers for all requests
    exp.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", process.env.API_ENDPOINT);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    // Proxy WebSocket connections to this server
    exp.use('/ws', createProxyMiddleware({ target: `ws://localhost:${PORT}`, ws: true }))

    // Create an HTTP server using the Express.js app instance
    const server = require('http').Server(exp);

    // Create a new WebSocket server using the HTTP server
    const wss = new ws.Server({ noServer: true });

    // Handle WebSocket connections
    wss.on('connection', (ws) => {
        console.log("A user has connected")
    });

    // Watch the MongoDB models for changes
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

    // Handle all other requests using the Next.js app instance
    exp.all('*', (req, res) => {
        return handle(req, res);
    });

    // Handle WebSocket upgrade requests
    server.on('upgrade', (req, socket, head) => {
        console.log("upgrade", req.url)

        // Only handle WebSocket upgrade requests for the /ws endpoint
        if (!req.url.includes('/_next/webpack-hmr')) {
            wss.handleUpgrade(req, socket, head, (ws) => {
                wss.emit('connection', ws, req);
            });
        }
    });

    // Start listening for incoming requests
    server.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`> Ready on ${process.env.API_ENDPOINT}:${PORT}`);
    });
}).catch((err) => {
    console.error(err.stack);
    process.exit(1);
});
