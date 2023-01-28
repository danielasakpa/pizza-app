import Image from "next/legacy/image";
import styles from "../styles/OrderCard.module.css";

const OrderCard = ({ visible, status, setVisible }) => {
  const { order, isVisible } = visible;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <span
          onClick={() => setVisible({ isVisible: !isVisible })}
          className={styles.close}
        >
          X
        </span>
        <div className={styles.Customer_head}>
          <span className={styles.Customer_details_head}>Order Id: </span>
          <span className={styles.Customer_details}>{order._id}</span>
        </div>
        <div className={styles.Customer_head}>
          <span className={styles.Customer_details_head}>Customer: </span>
          <span className={styles.Customer_details}>{order.customer}</span>
        </div>
        <div className={styles.Customer_head}>
          <span className={styles.Customer_details_head}>Email: </span>
          <span className={styles.Customer_details}>{order.email}</span>
        </div>
        <div className={styles.Customer_head}>
          <span className={styles.Customer_details_head}>Addresss: </span>
          <span className={styles.Customer_details}>{order.address}</span>
        </div>
        <div className={styles.Customer_head}>
          <span className={styles.Customer_details_head}>Status: </span>
          <span className={styles.Customer_details}>
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
          </span>
        </div>
        <div className={styles.products}>
          <table className={styles.table}>
            <tbody>
              <tr className={styles.trTitle}>
                <th>Image</th>
                <th>Id</th>
                <th>Title</th>
                <th>quantity</th>
                <th>extra</th>
              </tr>
            </tbody>
            {order.products.map((product) => (
              <tbody key={product._id}>
                <tr className={styles.trTitle}>
                  <td>
                    <Image
                      src={product.img}
                      width={50}
                      height={50}
                      objectFit="cover"
                      alt=""
                    />
                  </td>
                  <td>{product._id.slice(0, 5)}...</td>
                  <td>{product.title}</td>
                  <td>{product.quantity}</td>
                  <td>
                    {product.extraOptions.length === 0 ? (
                      <span>none</span>
                    ) : (
                      product.extraOptions.map((extra, i) => (
                        <div key={i}>
                          <span>{extra.text}</span>
                        </div>
                      ))
                    )}
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
