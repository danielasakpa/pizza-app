import { useState } from "react";
import Head from 'next/head'
import Featured from '../components/Featured'
import PizzaList from '../components/PizzaList'
import Add from "../components/Add";
import AddButton from "../components/AddButton";
import useSocket from "../hooks/useSockek";

export default function Home({ pizzaList, admin }) {
  const [close, setClose] = useState(true);
  const [pizzalist, setPizzaList] = useState(pizzaList);

  // use the custom hook to handle the socket connection
  useSocket(
    // Callback function for when socket connects
    () => console.log('Connected to WebSocket server'),
    // pass as null since it is not used in this component.
    null,
    // Callback function for when server sends "product-update" event
    (data) => {
      // check if the incoming data is for the current order
      if (data) {
        if (data.operationType === "delete") {
          //remove the deleted product from the pizzalist state
          setPizzaList(
            pizzalist.filter((pizza) => pizza._id !== data.documentKey._id)
          );
        } else if (data.operationType === "insert") {
          //add the new product to the pizzalist state
          setPizzaList((prev) => [...prev, data.fullDocument]);
        }
      }
    }
  );
  return (
    <>
      <Head>
        <title>Pizza Restaurant in Newyork</title>
        <meta name="description" content="Best pizza shop in town" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Featured />
        {admin ? <AddButton setClose={setClose} /> : null}
        <PizzaList pizzaList={pizzalist} />
        {!close ? <Add setClose={setClose} /> : null}
      </main>
    </>
  )
}


export const getServerSideProps = async (ctx) => {

  const myCookie = ctx.req?.cookies || "";
  let admin = false;

  if (myCookie.token === process.env.TOKEN) {
    admin = true;
  }

  const res = await fetch(`${process.env.API_ENDPOINT}/api/products`);

  const data = await res.json()

  return {
    props: {
      pizzaList: JSON.parse(JSON.stringify(data)),
      admin
    }
  }
}