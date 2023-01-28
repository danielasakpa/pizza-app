import { useReducer } from "react";
import styles from "../styles/Add.module.css";
import axios from "axios";

// import initial state and reducer function
import { initialState, reducer } from "../util/ProductFormReducer";

const Add = ({ setClose }) => {
  // use useReducer hook to manage state
  const [state, dispatchInput] = useReducer(reducer, pizza);

  // handle file input changes
  const handleFile = (e) => {
    // dispatch updateFile action to update file in state
    dispatchInput({ type: "updateFile", payload: e.target.files[0] });
  };

  // handle text input changes
  const handleChange = (event) => {
    const { name } = event.target;
    if (name === "title") {
      // dispatch updateTitle action to update title in state
      dispatchInput({ type: "updateTitle", payload: event.target.value });
    } else if (name === "desc") {
      // dispatch updateDesc action to update description in state
      dispatchInput({ type: "updateDesc", payload: event.target.value });
    }
  };

  // handle price input changes
  const changePrice = (e, index) => {
    const { value } = e.target;
    // dispatch updatePrices action to update prices in state
    dispatchInput({ type: "updatePrices", index, value });
  };

  // handle extra input changes
  const handleExtraInput = (e) => {
    const { name, value } = e.target;
    // dispatch updateExtra action to update extra in state
    dispatchInput({ type: "updateExtra", name, value });
  };

  // handle extra options input changes
  const handleExtra = (e) => {
    // dispatch updateExtraOptions action to update extra options in state
    dispatchInput({ type: "updateExtraOptions", payload: state.extra });
  };

  const handleCreate = async () => {
    const data = new FormData();
    data.append("file", state.file);
    data.append("upload_preset", "uploads");
    try {
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dutpzqbn1/image/upload",
        data
      );

      const { url } = uploadRes.data; // update the url variable with the new image url
      const newProduct = {
        title: state.title,
        desc: state.desc,
        prices: state.prices,
        extraOptions: state.extraOptions,
        img: url,
      };

      console.log(newProduct);

      // Send a PUT request to the server to create new product
      await axios.post(`${process.env.API_ENDPOINT}/api/products`, newProduct);
      // Close the form by calling the setClose function passed as a prop
      setClose(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <span onClick={() => setClose(true)} className={styles.close}>
          X
        </span>
        <h1>Add a new Pizza</h1>
        <div className={styles.item}>
          <label className={styles.label}>Choose an image</label>
          <input type="file" onChange={handleFile} />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Title</label>
          <input
            className={styles.input}
            type="text"
            name="title"
            onChange={handleChange}
          />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Desc</label>
          <textarea rows={4} type="text" name="desc" onChange={handleChange} />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Prices</label>
          <div className={styles.priceContainer}>
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="number"
              placeholder="Small"
              onChange={(e) => changePrice(e, 0)}
            />
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="number"
              placeholder="Medium"
              onChange={(e) => changePrice(e, 1)}
            />
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="number"
              placeholder="Large"
              onChange={(e) => changePrice(e, 2)}
            />
          </div>
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Extra</label>
          <div className={styles.extra}>
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="text"
              placeholder="Item"
              name="text"
              onChange={handleExtraInput}
            />
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="number"
              placeholder="Price"
              name="price"
              onChange={handleExtraInput}
            />
            <button className={styles.extraButton} onClick={handleExtra}>
              Add
            </button>
          </div>
          <div className={styles.extraItems}>
            {state.extraOptions.map((option) => (
              <span key={option.text} className={styles.extraItem}>
                {option.text}
              </span>
            ))}
          </div>
        </div>
        <button className={styles.addButton} onClick={handleCreate}>
          Create
        </button>
      </div>
    </div>
  );
};

export default Add;
