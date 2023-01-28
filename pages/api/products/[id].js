import dbConnect from "../../../util/mongo";
import Product from "../../../models/Product";

export default async function handler(req, res) {

    const { cookies, query: { id }, } = req;

    const token = cookies.token

    await dbConnect();

    if (req.method === "GET") {
        try {
            const product = await Product.findById(id);
            res.status(200).json(product);
        } catch (e) {
            console.error(e);
            throw new Error(e).message;
        }
    }

    if (req.method === "PUT") {
        try {
            const product = await Product.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            res.status(200).json(product);
        } catch (e) {
            console.error(e);
            throw new Error(e).message;
        }
    }

    if (req.method === "DELETE") {
        try {
            await Product.findByIdAndDelete(id);
            res.status(200).json("The product has been deleted!");
        } catch (e) {
            console.error(e);
            throw new Error(e).message;
        }
    }
}