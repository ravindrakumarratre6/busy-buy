import { useRef, useState } from "react";
import css from "./Css/FilterBox.module.css";
import { Outlet } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { filterProducts } from "../../Redux/Reducers/productsReducer";

export default function FilterBox() {

    const rangeRef = useRef();
    const [price, setPrice] = useState(90000);

    const dispatch = useDispatch();

    function handleFilter(e) {
        setPrice(rangeRef.current.value);
        dispatch(filterProducts(e));
    }


    return (
        <>
            <div className={css.container}>
                <div className={css.formContainer}>
                    <h1>Filter</h1>
                    <h1>&#x20B9; {price}</h1>
                    <form onChange={(e) => handleFilter(e)} action="">
                        <input type="range" ref={rangeRef} name="seekbar" min="0" max="100000" defaultValue="90000" /> <br />
                        <div className={css.checkBox_container}>
                            <input type="checkbox" id="Men's Clothing" name="Men's Clothing" value="Men's Clothing" />
                            <label htmlFor="Men's Clothing">Men's Clothing</label> <br />
                        </div>
                        <div className={css.checkBox_container}>
                            <input type="checkbox" id="Women's Clothing" name="Women's Clothing" value="Women's Clothing" />
                            <label htmlFor="Women's Clothing">Women's Clothing</label> <br />
                        </div>
                        <div className={css.checkBox_container}>
                            <input type="checkbox" id="Jewelery" name="Jewelery" value="Jewelery" />
                            <label htmlFor="Jewelery">Jewelery</label> <br />
                        </div>
                        <div className={css.checkBox_container}>
                            <input type="checkbox" id="Electronics" name="Electronics" value="Electronics" />
                            <label htmlFor="Electronics">Electronics</label> <br />
                        </div>
                    </form>
                </div>
            </div>
            <Outlet />
        </>
    )
}