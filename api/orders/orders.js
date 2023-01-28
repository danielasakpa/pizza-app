const express = require('express');
const dbConnect = require('../../util/mongo');
const Order = require('../../models/Order');

const router = express.Router();

const OrdersHandler = async (req, res) => {

    await dbConnect();

    if (req.method === "GET") {
        try {
            const orders = await Order.find();
            res.status(200).json(orders);
        } catch (e) {
            console.error(e);
            throw new Error(e).message;
        }
    }

    if (req.method === "POST") {
        try {
            const order = await Order.create(req.body);
            res.status(201).json(order);
        } catch (e) {
            console.error(e);
            throw new Error(e).message;
        }
    }
};

const OrderHandler = async (req, res) => {
    const {
        cookies,
        params: { orderId },
    } = req;

    // const token = cookies.token
    console.log('Cookies: ', cookies)

    await dbConnect();

    if (req.method === "GET") {
        try {
            const order = await Order.findById(orderId);
            res.status(200).json(order);
        } catch (e) {
            console.error(e);
            throw new Error(e).message;
        }
    }

    if (req.method === "PUT") {
        // if (!token || token !== process.env.TOKEN) {
        //     return res.status(401).json("Not authenticated!")
        // }
        try {
            const order = await Order.findByIdAndUpdate(orderId, req.body, {
                new: true,
            });
            res.status(200).json(order);
        } catch (e) {
            console.error(e);
            throw new Error(e).message;
        }
    }

    if (req.method === "DELETE") {
        // if (!token || token !== process.env.TOKEN) {
        //     return res.status(401).json("Not authenticated!")
        // }
        try {
            await Order.findByIdAndDelete(orderId);
            res.status(200).json("The Order has been deleted!");
        } catch (e) {
            console.error(e);
            throw new Error(e).message;
        }
    }
};

router.route("/api/orders").get(OrdersHandler).post(OrdersHandler)
router.route("/api/orders/:orderId").get(OrderHandler).put(OrderHandler).delete(OrderHandler)

module.exports = router;