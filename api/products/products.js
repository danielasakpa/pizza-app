const express = require('express');
const dbConnect = require('../../util/mongo');
const Product = require('../../models/Product');
var cookie = require('cookie');


const router = express.Router();

const ProductsHandler = async (req, res) => {

    const { cookies } = req;

    // const token = cookies.token
    // console.log(req)
    console.log('Cookies: ', cookies)

    await dbConnect();

    if (req.method === 'GET') {
        try {
            const products = await Product.find();
            res.status(200).json(products);
        } catch (e) {
            console.error(e);
            throw new Error(e).message;
        }
    }

    if (req.method === "POST") {
        // if (!token || token !== process.env.TOKEN) {
        //     return res.status(401).json("Not authenticated!")
        // }
        try {
            const product = await Product.create(req.body);
            res.status(201).json(product);
        } catch (e) {
            console.error(e);
            throw new Error(e).message;
        }
    }
}

const ProductHandler = async (req, res) => {

    const { cookies, params: { productId } } = req;

    // const token = cookies.token

    console.log('Cookies: ', cookies)


    await dbConnect();

    if (req.method === "GET") {
        try {
            const product = await Product.findById(productId);
            res.status(200).json(product);
        } catch (e) {
            console.error(e);
            throw new Error(e).message;
        }
    }

    if (req.method === "PUT") {
        if (!token || token !== process.env.TOKEN) {
            return res.status(401).json("Not authenticated!")
        }
        try {
            const product = await Product.findByIdAndUpdate(productId, req.body, {
                new: true,
            });
            res.status(200).json(product);
        } catch (e) {
            console.error(e);
            throw new Error(e).message;
        }
    }

    if (req.method === "DELETE") {
        if (!token || token !== process.env.TOKEN) {
            return res.status(401).json("Not authenticated!")
        }
        try {
            await Product.findByIdAndDelete(productId);
            res.status(200).json("The product has been deleted!");
        } catch (e) {
            console.error(e);
            throw new Error(e).message;
        }
    }

    // router.param("productId", req.params.productId);
}

router.route("/api/products").get(ProductsHandler).post(ProductsHandler)
router.route("/api/products/:productId").get(ProductHandler).put(ProductHandler).delete(ProductHandler)

module.exports = router;