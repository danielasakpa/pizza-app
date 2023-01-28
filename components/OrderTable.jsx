import { useState } from "react";
import styles from "../styles/Admin.module.css";
import OrderCard from "./OrderCard";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";

const OrderTable = ({ initialOrderList, setInitialOrderList }) => {
  const [orderList, setOrderList] = useState(
    initialOrderList.sort((a, b) => {
      return a.status - b.status;
    })
  );

  const [visible, setVisible] = useState({ isVisible: false, order: {} });

  // an array of status options for orders
  const status = ["new order", "preparing", "on the way", "delivered"];

  // function to handle updating the status of an order
  const handleStatus = async (id) => {
    // find the current order in the orderList state
    const item = orderList.find((order) => order._id === id);
    // get the current status of the order
    const currentStatus = item.status;

    if (currentStatus === 2) {
      toast.success(`Order ${status[currentStatus]}`);
    }

    try {
      // make a PUT request to the server to update the status of the order
      const res = await axios.put(
        `${process.env.API_ENDPOINT}/api/orders/` + id,
        {
          status: currentStatus + 1,
        }
      );
      // update the state of the orderList by replacing the updated order
      setInitialOrderList((prev) =>
        prev.map((order) => (order._id === id ? res.data : order))
      );
      // checks if orderList contain all order
      orderList.length !== initialOrderList.length
        ? setOrderList(orderList.filter((order) => order._id !== id))
        : // update orderList to update UI
          setOrderList((prev) =>
            prev
              .map((order) => (order._id === id ? res.data : order))
              .sort((a, b) => {
                return a.status - b.status;
              })
          );
    } catch (err) {
      // display an error toast message
      toast.error(err);
    }
  };

  const filterOrders = (i) => {
    const filteredOrders = initialOrderList.filter(
      (order) => order.status === i
    );
    const sortedOrders = filteredOrders.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setOrderList(sortedOrders);
  };

  return (
    <>
      <div className={styles.item}>
        <h1 className={styles.title}>Orders</h1>
        <div className={styles.statusFilter}>
          <button
            onClick={() => setOrderList(initialOrderList)}
            className={styles.filterBtn}
          >
            All
          </button>
          {status.map((s, i) => (
            <button
              key={i}
              onClick={() => filterOrders(i)}
              className={styles.filterBtn}
            >
              {s}
            </button>
          ))}
        </div>
        <div className={styles.order}>
          <table className={styles.table}>
            <tbody>
              <tr className={styles.trTitle}>
                <th>Id</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </tbody>
            {orderList.map((order) => (
              <tbody key={order._id}>
                <tr className={styles.trTitle}>
                  <td>{order._id.slice(0, 5)}...</td>
                  <td
                    onClick={() =>
                      setVisible({
                        isVisible: !visible.isVisible,
                        order: order,
                      })
                    }
                  >
                    {order.customer}
                  </td>
                  <td>${order.total}</td>
                  <td>
                    {order.method === 1 ? <span>cash</span> : <span>paid</span>}
                  </td>
                  <td>
                    {order.status > 2 ? (
                      <Image
                        src="/img/checked.png"
                        width={30}
                        height={30}
                        objectFit="cover"
                        alt=""
                      />
                    ) : (
                      status[order.status]
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleStatus(order._id)}>
                      Next Stage
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>
      {visible.isVisible && (
        <div className={styles.backdrop}>
          <OrderCard
            order={visible.order}
            visible={visible}
            status={status}
            setVisible={setVisible}
          />
        </div>
      )}
    </>
  );
};

export default OrderTable;
