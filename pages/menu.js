import React from 'react'
import axios from 'axios'
import PizzaList from '../components/PizzaList'

const Menu = ({ pizzaList }) => {
    return (
        <div>
            <PizzaList pizzaList={pizzaList} />
        </div>
    )
}

export const getServerSideProps = async () => {
    const res = await axios.get(`${process.env.API_ENDPOINT}/api/products`);
    return {
        props: {
            pizzaList: res.data,
        }
    }
}

export default Menu