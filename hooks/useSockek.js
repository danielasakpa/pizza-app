import { useWebSocket } from "react-use-websocket";

const useSocket = (onConnect, onOrderUpdate, onProductUpdate) => {
    const [sendMessage, lastMessage, readyState] = useWebSocket(`wss://pizza-app-lime.vercel.app`);

    useEffect(() => {
        if (readyState === 1 && onConnect) {
            onConnect();
        }
    }, [readyState, onConnect]);

    useEffect(() => {
        if (lastMessage) {
            const { type, data } = JSON.parse(lastMessage.data);

            if (type === "order-update" && onOrderUpdate) {
                onOrderUpdate(data);
            } else if (type === "product-update" && onProductUpdate) {
                onProductUpdate(data);
            }
        }
    }, [lastMessage, onOrderUpdate, onProductUpdate]);
};

export default useSocket;
