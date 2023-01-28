import styles from "../../styles/Product.module.css";
import Image from "next/legacy/image";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/cartSlice";

const Product = ({ pizza }) => {
    const [price, setPrice] = useState(pizza.prices[0]);
    const [size, setSize] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [extras, setExtras] = useState([]);
    const dispatch = useDispatch();

    // Helper function to change the price
    const changePrice = (number) => {
        setPrice(price + number);
    };

    // Function to handle when a size is selected
    const handleSize = (sizeIndex) => {
        // Calculate the difference in price between the currently selected size and the new size
        const difference = pizza.prices[sizeIndex] - pizza.prices[size];
        // Update the size state
        setSize(sizeIndex)
        // Update the price state
        changePrice(difference);
    }

    // Function to handle when an extra option is selected
    const handleChange = (e, option) => {
        // Check if the option is being selected or deselected
        const checked = e.target.checked;

        if (checked) {
            // If being selected, increase the price and add the option to the extras state
            changePrice(option.price)
            setExtras(prev => [...prev, option])
        } else {
            // If being deselected, decrease the price and remove the option from the extras state
            changePrice(-option.price);
            setExtras(extras.filter((extra) => extra._id !== option._id));
        }
    }

    // Function to handle when the add to cart button is clicked
    const handleClick = () => {
        // Dispatch the addProduct action with the necessary information
        dispatch(addProduct({ ...pizza, extras, price, quantity }));
    }

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.imgContainer}>
                    <Image src={pizza.img} objectFit="contain" layout="fill" alt="" />
                </div>
            </div>
            <div className={styles.right}>
                <h1 className={styles.title}>{pizza.title}</h1>
                <span className={styles.price}>${price}</span>
                <p className={styles.desc}>{pizza.desc}</p>
                <h3 className={styles.choose}>Choose the size</h3>
                <div className={styles.sizes}>
                    <div className={styles.size} onClick={() => handleSize(0)}>
                        <Image src="/img/size.png" layout="fill" alt="" />
                        <span className={styles.number}>Small</span>
                    </div>
                    <div className={styles.size} onClick={() => handleSize(1)}>
                        <Image src="/img/size.png" layout="fill" alt="" />
                        <span className={styles.number}>Medium</span>
                    </div>
                    <div className={styles.size} onClick={() => handleSize(2)}>
                        <Image src="/img/size.png" layout="fill" alt="" />
                        <span className={styles.number}>Large</span>
                    </div>
                </div>
                <h3 className={styles.choose}>Choose additional ingredients</h3>
                <div className={styles.ingredients}>
                    {
                        pizza.extraOptions.map((option, i) => (
                            <div key={i} className={styles.option}>
                                <input
                                    type="checkbox"
                                    id={option.id}
                                    name={option.id}
                                    className={styles.checkbox}
                                    onChange={(e) => handleChange(e, option)}
                                />
                                <label htmlFor="double">{option.text}</label>
                            </div>
                        ))
                    }
                </div>
                <div className={styles.add}>
                    <input
                        onChange={(e) => setQuantity(e.target.value)}
                        type="number"
                        defaultValue={1}
                        min="1"
                        className={styles.quantity} />
                    <button onClick={handleClick} className={styles.button}>Add to Cart</button>
                </div>
            </div>
        </div>
    );
};


export const getServerSideProps = async ({ params }) => {
    const res = await fetch(`${process.env.API_ENDPOINT}/api/products/${params.id}`)

    const data = await res.json()

    return {
        props: {
            pizza: JSON.parse(JSON.stringify(data)),
        }
    }
}

export default Product;