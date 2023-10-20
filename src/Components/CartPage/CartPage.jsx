import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../../Firebase/Firebase';
import css from "./Css/CartPage.module.css";
import CartItem from './CartItem';
import { myCartSelector, userSelector } from '../../Redux/selectors';
import { allActions } from '../../Redux/action';
import { useDispatch, useSelector } from "react-redux";
import { purchase } from '../../Redux/Reducers/myCartReducer';


export default function CartPage() {

  // State to store the total price of items in the cart
  const [totalPrice, setTotalPrice] = useState(0);

  const dispatch = useDispatch();

  // Get the user UID from the Redux store using the userSelector
  const userUid = useSelector(userSelector);

  // Get the cart items from the Redux store using the myCartSelector
  const cartItems = useSelector(myCartSelector);

  useEffect(() => {
    // Variable to store the unsubscribe function returned by onSnapshot
    let unsubscribe;

    // Function to fetch data from Firestore and set up real-time listener
    const fetchData = async () => {
      try {
        if (userUid) {
          // Set up the real-time listener for the Firestore collection
          unsubscribe = await onSnapshot(collection(db, "User", userUid, "MyCart"), async (querySnapshot) => {
            const newCartItems = [];
            let totalPrice = 0;
            if (!querySnapshot.empty) {
              querySnapshot.forEach((doc) => {
                const { price, qty } = doc.data();
                totalPrice += price * qty;
                newCartItems.push({ itemRef: doc.id, ...doc.data() });
              });
              await setTotalPrice(totalPrice);
              // Dispatch action to update the cart items in the Redux store
              dispatch(allActions.myCartActions.updateCart(newCartItems));
            } else {
              // If cart is empty, set total price to 0 and update the Redux store with an empty cart
              await setTotalPrice(0);
              dispatch(allActions.myCartActions.updateCart([]));
            }
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the fetchData function
    fetchData();

    // Return a cleanup function to unsubscribe the listener when the component unmounts or when userUid changes
    return () => {
      if (unsubscribe) {
        unsubscribe(); // Unsubscribe the listener
      }
    };
  }, [userUid, dispatch]);


  // Function to handle the purchase button click
  async function handlePurchase(e) {
    e.preventDefault();
    // Dispatch the purchase action to update the Firestore and Redux store
    await dispatch(purchase());
    // Reset the total price to 0 after purchase
    setTotalPrice(0);
  }


  return (
    <>
      {/* Purchase box displaying total price and purchase button */}
      <div className={css.container}>
        <div className={css.purchaseBox}>
          <div className={css.purchase}>
            <h1>Total Price:</h1>
            <h2>&#x20B9; {totalPrice}</h2>
            <button onClick={(e) => handlePurchase(e)}>Purchase</button>
          </div>
        </div>
      </div>

      {/* Cart items displayed using CartItem component */}
      <div className={css.CartPage}>
        {cartItems && cartItems.map((item) => <CartItem key={item.itemRef} item={item} />)}
      </div>
    </>
  );
}
