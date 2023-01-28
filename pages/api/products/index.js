import dbConnect from "../../../util/mongo";
import Product from "../../../models/Product";

const handler = async (req, res) => {

    const { cookies } = req;

    const token = cookies.token

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

export default handler;