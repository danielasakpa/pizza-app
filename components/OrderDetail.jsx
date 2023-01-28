import { useState, useReducer } from "react";
import styles from "../styles/OrderDetail.module.css";
import Loader from "./Loader";
import { useDispatch } from "react-redux";
import { PaystackButton } from "react-paystack";
import { initialState, reducer } from "../util/OrderFormReducer";
import { useRouter } from "next/router";
import { reset } from "../redux/cartSlice";
import axios from "axios";
import { toast } from "react-toastify";

const OrderDetail = ({ cart, setVisible }) => {
  const [state, dispatchInput] = useReducer(reducer, initialState);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  // Helper function to format cart products for API call
  const products = () => {
    return cart.products.map((product) => {
      return {
        title: product.title,
        img: product.img,
        extraOptions: product.extras,
        quantity: product.quantity,
      };
    });
  };

  // Event handler for input changes
  const handleChange = (event) => {
    dispatchInput({ type: event.target.name, payload: event.target.value });
  };

  // Event handler for input blur events
  const handleBlur = (event) => {
    switch (event.target.name) {
      case "updateCustomer":
        dispatchInput({ type: "validateCustomer" });
        break;
      case "updateEmail":
        dispatchInput({ type: "validateEmail" });
        break;
      default:
        return;
    }
  };

  // Event handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!state.customer || !state.email || !state.address) {
      toast.error("Please fill out all required fields");
      return;
    }
    setIsValid(true);
  };

  // Function to create a new order
  const createOrder = async (data) => {
    try {
      const res = await axios.post(
        `${process.env.API_ENDPOINT}/api/orders`,
        data
      );
      if (res.status === 201) {
        setIsLoading(false);
        dispatch(reset());
        router.push(`/orders/${res.data._id}`);
      }
    } catch (err) {
      toast.error(err);
    }
  };

  // Event handler for cash button click
  const handleClick = () => {
    setVisible(false);
    setIsLoading(true);
    createOrder({
      customer: state.customer,
      email: state.email,
      address: state.address,
      total: cart.total,
      products: products(),
      method: 1,
    });
  };

  // Props for the paystack button component
  const componentProps = {
    email: state.email,
    amount: cart.total,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
    text: "Pay Stack",
    metadata: {
      custom_fields: [
        {
          display_name: state.customer,
        },
      ],
    },
    onSuccess: () => {
      setVisible(false);
      setIsLoading(true);
      createOrder({
        customer: state.customer,
        email: state.email,
        address: state.address,
        total: cart.total,
        products: products(),
        method: 0,
      });
    },
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <span onClick={() => setVisible(false)} className={styles.close}>
              X
            </span>
            <h1 className={styles.title}>
              You will pay ${cart.total} after delivery.
            </h1>
            <form className={styles.wrapper} onSubmit={handleSubmit}>
              <div className={styles.item}>
                <label className={styles.label}>Name Surname</label>
                <input
                  placeholder="Name Surname"
                  type="text"
                  className={styles.input}
                  name="updateCustomer"
                  value={state.customer}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {state.customerError && (
                  <p className={styles.formError}>{state.customerError}</p>
                )}
              </div>
              <div className={styles.item}>
                <label className={styles.label}>Email</label>
                <input
                  placeholder="email"
                  type="text"
                  className={styles.input}
                  name="updateEmail"
                  value={state.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {state.emailError && (
                  <p className={styles.formError}>{state.emailError}</p>
                )}
              </div>
              <div className={styles.item}>
                <label className={styles.label}>Address</label>
                <textarea
                  rows={5}
                  placeholder="Elton St. 505 NY"
                  type="text"
                  className={styles.textarea}
                  name="updateAddress"
                  value={state.address}
                  onChange={handleChange}
                  required
                />
              </div>
              {isValid ? (
                <div className={styles.ckeck_out_button}>
                  <button className={styles.button} onClick={handleClick}>
                    Cash on delevery
                  </button>
                  <PaystackButton
                    {...componentProps}
                    className={styles.button}
                  />
                </div>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className={styles.button}
                >
                  Order Now
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetail;
