import { useEffect } from "react";

// Custom hook to handle socket connection
const useSocket = (onConnect, onOrderUpdate, onProductUpdate) => {
    useEffect(() => {
        const socket = new WebSocket(`wss://pizza-app3.netlify.app`);

        if (onConnect) {
            socket.onopen = onConnect;
        }
        if (onOrderUpdate || onProductUpdate) {
            socket.onmessage = (event) => {
                const { type, data } = JSON.parse(event.data);

                if (type === "order-update" && onOrderUpdate) {
                    onOrderUpdate(data);
                } else if (type === "product-update" && onProductUpdate) {
                    onProductUpdate(data);
                }
            }
        }
    }, []);
};

export default useSocket;