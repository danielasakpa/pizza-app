import { useState } from "react";
import styles from "../styles/Admin.module.css";
import Edit from "../components/Edit";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";

const ProductTable = ({ pizzaList, setPizzaList }) => {
  const [close, setClose] = useState(true);

  // function to handle deletion of a product
  const handleDelete = async (id) => {
    try {
      // make a DELETE request to the server to delete the product
      const res = await axios.delete(
        `${process.env.API_ENDPOINT}/api/products/` + id
      );
      // update the state of the pizzaList by removing the deleted product
      setPizzaList(pizzaList.filter((pizza) => pizza._id !== id));
      // display a success toast message
      toast.success(res.data);
    } catch (err) {
      // display an error toast message
      toast.error(err);
    }
  };

  return (
    <div className={styles.item}>
      <h1 className={styles.title}>Products</h1>
      <div className={styles.products}>
        <table className={styles.table}>
          <tbody>
            <tr className={styles.trTitle}>
              <th>Image</th>
              <th>Id</th>
              <th>Title</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </tbody>
          {pizzaList.map((product) => (
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
                <td>${product.prices[0]}</td>
                <td>
                  <button
                    className={styles.button}
                    onClick={() => setClose(false)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.button}
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
              {!close ? <Edit setClose={setClose} pizza={product} /> : null}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
