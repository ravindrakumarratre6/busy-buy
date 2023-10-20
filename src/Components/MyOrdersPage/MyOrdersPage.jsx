import React, { useEffect, useState } from 'react';
import css from "./Css/MyOrdersPage.module.css";
import Table from './Table';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase';
import { notify } from "../../Components/Notify/notify";
import { useSelector } from 'react-redux';
import { userSelector } from '../../Redux/selectors';

export default function MyOrdersPage() {

  const [myOrders, setMyorders] = useState();
  const userUID = useSelector(userSelector);
  useEffect(() => {
    // Define an async function to fetch user's orders from Firestore
    const fetchOrders = async () => {
      try {
        // Get the orders collection from Firestore for the current user
        const querySnapshot = await getDocs(collection(db, "User", userUID, "MyOrders"));

        // If the user has no orders, show a message and return early
        if (querySnapshot.empty) {
          notify("info", "You haven't bought anything yet.");
          return;
        }

        // If the user has orders, process each order and add it to an array
        const singleOrderArray = [];
        querySnapshot.forEach((doc) => {
          const { purchaseDate, itemsList } = doc.data();
          singleOrderArray.push({ id: doc.id, purchaseDate, itemsList });
        });

        // Set the array of orders to the component's state
        setMyorders(singleOrderArray);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    // Call the fetchOrders function when the component mounts
    fetchOrders();
  }, []);


  
  return (
    <div className={css.MyOrdersPage}>
      {/* Render each order as a Table component */}
      {myOrders && myOrders.map((myOrder) => <Table key={myOrder.id} myOrder={myOrder} />)}
    </div>
  );
}
