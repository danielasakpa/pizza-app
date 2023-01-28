import { useState } from "react";
import styles from "../styles/Cart.module.css";
import Image from "next/legacy/image";
import OrderDetail from "../components/OrderDetail";
import { useSelector, useDispatch } from "react-redux";
import { addOneProduct, removeOneProduct } from "../redux/cartSlice";

const Cart = () => {
  const [visible, setVisible] = useState(false);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleRemoveFromCart = (title, price) => {
    dispatch(removeOneProduct({ title, price }));
  };

  const handleAddToCart = (title, price) => {
    dispatch(addOneProduct({ title, price }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <table className={styles.table}>
          <tbody>
            <tr className={styles.trTitle}>
              <th>Product</th>
              <th>Name</th>
              <th>Extras</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </tbody>
          <tbody>
            {cart.products.map((product) => (
              <tr className={styles.tr} key={product._id}>
                <td>
                  <div className={styles.imgContainer}>
                    <Image
                      src={product.img}
                      layout="fill"
                      objectFit="cover"
                      alt=""
                    />
                  </div>
                </td>
                <td>
                  <span className={styles.name}>{product.title}</span>
                </td>
                <td>
                  <span className={styles.extras}>
                    {product.extras.map((extra) => (
                      <span key={extra._id}>{extra.text}, </span>
                    ))}
                  </span>
                </td>
                <td>
                  <span className={styles.price}>${product.price}</span>
                </td>
                <td>
                  <button
                    onClick={() =>
                      handleRemoveFromCart(product.title, product.price)
                    }
                    className={styles.quantityBtn}
                  >
                    -
                  </button>
                  <span className={styles.quantity}>{product.quantity}</span>
                  <button
                    onClick={() =>
                      handleAddToCart(product.title, product.price)
                    }
                    className={styles.quantityBtn}
                  >
                    +
                  </button>
                </td>
                <td>
                  <span className={styles.total}>
                    ${product.price * product.quantity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.right}>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>CART TOTAL</h2>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Subtotal:</b>${cart.total}
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Discount:</b>$0.00
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Total:</b>${cart.total}
          </div>
          <button onClick={() => setVisible(true)} className={styles.button}>
            CHECKOUT NOW!
          </button>
        </div>
      </div>
      {visible && (
        <div className={styles.backdrop}>
          <OrderDetail cart={cart} setVisible={setVisible} />
        </div>
      )}
    </div>
  );
};

export default Cart;
