import { useEffect } from "react";

// Custom hook to handle socket connection
const useSocket = (onConnect, onOrderUpdate, onProductUpdate) => {
    useEffect(() => {
        // NOTE: WebSocket server only works in development
        // const socket = new WebSocket('ws://localhost:3000')

        // Set up event listener for onConnect
        if (onConnect) {
            socket.onopen = onConnect;
        }

        // Set up event listener for onOrderUpdate and onProductUpdate
        if (onOrderUpdate || onProductUpdate) {
            socket.onmessage = (event) => {
                const { type, data } = JSON.parse(event.data);

                // If the message is an order-update and onOrderUpdate is provided, trigger the callback function
                if (type === "order-update" && onOrderUpdate) {
                    onOrderUpdate(data);
                }
                // If the message is a product-update and onProductUpdate is provided, trigger the callback function
                else if (type === "product-update" && onProductUpdate) {
                    onProductUpdate(data);
                }
            }
        }
    }, []);
};

export default useSocket;
