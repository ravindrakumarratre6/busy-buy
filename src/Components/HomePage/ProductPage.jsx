import React, { useEffect } from 'react'
import Item from './Item'
import css from "./Css/ProductPage.module.css"
import { useDispatch, useSelector } from 'react-redux';
import { productsSelector } from '../../Redux/selectors';
import { KeyWordFilter, initialProductsRendering } from '../../Redux/Reducers/productsReducer';

export default function ProductPage() {

    const dispatch = useDispatch();
    const products = useSelector(productsSelector);

    useEffect(() => {
        dispatch(initialProductsRendering())
    }, [])

    return (
        <div className={css.productPage}>
            <div className={css.inputField}>
                <input onChange={(e) => dispatch(KeyWordFilter(e.target.value))} type="text" placeholder='Filter by SearchProduct....' />
            </div>
            {products && products.map((item) => <Item key={item.id} item={item} />
            )}
        </div>
    )
}
