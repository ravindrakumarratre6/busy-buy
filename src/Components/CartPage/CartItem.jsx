import React from 'react'
import css from "./Css/CartItem.module.css"
import plus from "../../image/plus.png"
import minus from "../../image/minus.png"
import removeFromCartImg from "../../image/removeFromCart.png"
import { decreaseQuantity, increaseQuantity, removeFromCart } from '../../Redux/Reducers/myCartReducer';
import { useDispatch } from 'react-redux';



export default function CartItem(props) {

    const { itemRef, name, image, price, qty } = props.item;

    const dispatch = useDispatch();


    return (
        <div className={css.Item}>
            <div className={css.imageContainer}>
                <img src={image} alt="" />
            </div>
            <div className={css.itemDetail}>
                <p>{name}</p>
                <div>
                    <h1>&#x20B9; {price}</h1>
                    <div>
                        <img src={qty === 0 ? removeFromCartImg : minus} alt="" onClick={() => dispatch(decreaseQuantity({ itemRef, qty }))} />
                        <span>{qty}</span>
                        <img src={plus} alt="" onClick={() => dispatch(increaseQuantity({ itemRef, qty }))} />
                    </div>
                </div>
            </div>
            <div className={css.btn}>
                <button onClick={() => dispatch(removeFromCart(itemRef))}>Remove item</button>
            </div>
        </div>
    )
}
