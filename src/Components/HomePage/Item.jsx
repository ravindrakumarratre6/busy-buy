import React from 'react'
import css from "./Css/Item.module.css"
import { useDispatch } from 'react-redux';
import { addItem } from '../../Redux/Reducers/myCartReducer';

export default function Item(props) {
    const { name, price, image } = props.item;

    const dispatch = useDispatch();

    const handleAddToCart = (e) => {
        dispatch(addItem(props.item))
    }

    return (
        <div className={css.Item}>
            <div className={css.imageContainer}>
                <img src={image} alt="" />
            </div>
            <div className={css.itemDetail}>
                <p>{name}</p>
                <h2>&#x20B9; {price}</h2>
            </div>
            <div className={css.btn}>
                <button onClick={(e) => handleAddToCart(e)}>ADD to Cart</button>
            </div>
        </div>
    )
}
