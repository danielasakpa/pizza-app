import { useReducer } from "react";
import styles from "../styles/Add.module.css";
import axios from "axios";

// import initial state and reducer function
import { initialState, reducer } from "../util/ProductFormReducer";

const Edit = ({ setClose, pizza }) => {
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

  // handle remove extra options
  const removeExtra = (extra) => {
    // dispatch removeExtraOptions action to remove extra options in state
    dispatchInput({ type: "removeExtraOptions", payload: extra });
  };

  // handle form submission
  const handleEdit = async () => {
    let url = state.img; // initialize url to the previous img value

    // only execute the following code if a new file was selected
    if (state.file) {
      const data = new FormData();
      data.append("file", state.file);
      data.append("upload_preset", "uploads");
      try {
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dutpzqbn1/image/upload",
          data
        );
        url = uploadRes.data.url; // update the url variable with the new image url
      } catch (err) {
        console.log(err);
      }
    }

    const editProduct = {
      desc: state.desc,
      prices: state.prices,
      extraOptions: state.extraOptions,
      img: url,
    };

    // Send a PUT request to the server with the updated product information
    await axios.put(
      `${process.env.API_ENDPOINT}/api/products/` + state._id,
      editProduct
    );
    // Close the form by calling the setClose function passed as a prop
    setClose(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <span onClick={() => setClose(true)} className={styles.close}>
          X
        </span>
        <h1>Edit a new Pizza</h1>
        <div className={styles.item}>
          <label className={styles.label}>Choose an image</label>
          <input type="file" onChange={handleFile} />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Desc</label>
          <textarea
            rows={4}
            type="text"
            name="desc"
            defaultValue={state.desc}
            onChange={handleChange}
          />
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
              <span
                key={option.text}
                className={styles.extraItem}
                onClick={() => removeExtra(option.text)}
              >
                {option.text}
              </span>
            ))}
          </div>
        </div>
        <button className={styles.addButton} onClick={handleEdit}>
          Edit
        </button>
      </div>
    </div>
  );
};

export default Edit;
