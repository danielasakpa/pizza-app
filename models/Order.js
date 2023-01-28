const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema(
    {
        customer: {
            type: String,
            required: true,
            maxlength: 60,
        },
        email: {
            type: String,
            required: true,
            maxlength: 200,
        },
        address: {
            type: String,
            required: true,
            maxlength: 200,
        },
        products: {
            type: [
                {
                    title: {
                        type: String,
                        required: true,
                        maxlength: 60,
                    },
                    img: {
                        type: String,
                        required: true,
                    },
                    quantity: {
                        type: Number,
                        required: true,
                    },
                    extraOptions: {
                        type: [
                            {
                                text: { type: String, required: true },
                                price: { type: Number, required: true },
                            },
                        ],
                    },
                },
            ],
        },
        total: {
            type: Number,
            required: true,
        },
        status: {
            type: Number,
            default: 0,
        },
        method: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", OrderSchema);