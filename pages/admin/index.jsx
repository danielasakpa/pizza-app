import { useState } from "react";
import OrderTable from "../../components/OrderTable";
import ProductTable from "../../components/ProductTable";
import styles from "../../styles/Admin.module.css";
import { toast } from "react-toastify";
import useSocket from "../../hooks/useSockek";

const Index = ({ products, orders }) => {
  const [pizzaList, setPizzaList] = useState(products);
  const [initialOrderList, setInitialOrderList] = useState(orders);

  // use the custom hook to handle the socket connection
  useSocket(
    // Callback function for when socket connects
    () => console.log("Connected to WebSocket server"),
    (data) => {
      if (
        data.fullDocument &&
        data.operationType === "insert" &&
        data.ns.coll === "orders"
      ) {
        // If data has a fullDocument property and operationType is "insert"
        // update the orderList state with the new fullDocument
        setInitialOrderList((prev) => [...prev, data.fullDocument]);
        toast.success("There's a new Order");
      }
    },
    (data) => {
      if (data) {
        // Check if there is any data
        if (
          data.fullDocument &&
          data.operationType === "insert" &&
          data.ns.coll === "products"
        ) {
          // If operationType is "insert" update the pizzaList state with the new fullDocument
          setPizzaList((prev) => [...prev, data.fullDocument]);
        } else if (data.operationType === "update") {
          // If operationType is "update"
          // Find the product that matches the updated product's id and update that product in the state
          setPizzaList(
            pizzaList.map((product) => {
              if (product._id === data.documentKey._id) {
                return Object.assign(
                  {},
                  product,
                  data.updateDescription.updatedFields
                );
              }
              return product;
            })
          );
        }
      }
    }
  );

  return (
    <div className={styles.container}>
      <ProductTable pizzaList={pizzaList} setPizzaList={setPizzaList} />
      <OrderTable
        initialOrderList={initialOrderList}
        setInitialOrderList={setInitialOrderList}
      />
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const myCookie = ctx.req?.cookies || "";

  if (myCookie.token !== process.env.TOKEN) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  const productRes = await fetch(`${process.env.API_ENDPOINT}/api/products`);
  const orderRes = await fetch(`${process.env.API_ENDPOINT}/api/orders`);

  const productData = await productRes.json();
  const orderData = await orderRes.json();

  return {
    props: {
      orders: JSON.parse(JSON.stringify(orderData)),
      products: JSON.parse(JSON.stringify(productData)),
    },
  };
};

export default Index;
