import dbConnect from "../../../util/mongo";
import Order from "../../../models/Order";

const handler = async (req, res) => {
    const {
        cookies,
        query: { id },
    } = req;

    const token = cookies.token

    await dbConnect();

    if (req.method === "GET") {
        try {
            const order = await Order.findById(id);
            res.status(200).json(order);
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
            const order = await Order.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            res.status(200).json(order);
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
            await Order.findByIdAndDelete(id);
            res.status(200).json("The Order has been deleted!");
        } catch (e) {
            console.error(e);
            throw new Error(e).message;
        }
    }
};

export default handler;