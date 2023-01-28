import dbConnect from "../../../util/mongo";
import Order from "../../../models/Order";

const handler = async (req, res) => {

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

export default handler;