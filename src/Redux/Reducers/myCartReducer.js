import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import { notify } from "../../Components/Notify/notify";

const initialState = {
    cartItems: []
}



//## Add Item to Cart

export const addItem = createAsyncThunk("myCartReducer/addItem", async (payload, thunkAPI) => {
    //~ payload = {id,name,price,image}

    const userUID = thunkAPI.getState().userReducer.userUID;
    if (!userUID) {
        notify("warn", "Please SignIn First");
        return;
    }
    const { id } = payload;

    // Create a Firestore query to check if the item is already in the user's cart
    const q = query(collection(db, "User", userUID, "MyCart"), where("id", "==", id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        // Item is not in the cart, so add it
        await addDoc(collection(db, "User", userUID, "MyCart"), {
            ...payload,
            qty: 1
        }).then(() => {
            notify("success", "Item Has Been Added Successfully");
        });
    } else {
        // Item is already in the cart
        notify("warn", "Item is already in the cart");
    }
});




//## Remove Particular Product from Cart

export const removeFromCart = createAsyncThunk("myCartActions/removeFromCart", async (payload, thunkAPI) => {
    const userUID = thunkAPI.getState().userReducer.userUID;

    // Delete the item from the user's cart in Firestore
    await deleteDoc(doc(db, "User", userUID, "MyCart", payload));
});




//## Increase Quantity of a Particular Product in Cart

export const increaseQuantity = createAsyncThunk("myCartActions/increaseQuantity", async (payload, thunkAPI) => {
    //~ payload = {itemRef, qty}

    const userUID = thunkAPI.getState().userReducer.userUID;
    const { itemRef, qty } = payload;

    // Update the quantity of the item in the user's cart in Firestore
    await updateDoc(doc(db, "User", userUID, "MyCart", itemRef), {
        qty: qty + 1
    });
});




//## Decrease Quantity of a Particular Product in Cart

export const decreaseQuantity = createAsyncThunk("myCartActions/decreaseQuantity", async (payload, thunkAPI) => {
    //~ payload = {itemRef, qty}

    const userUID = thunkAPI.getState().userReducer.userUID;
    const { itemRef, qty } = payload;
    if (qty === 0) {
        // If the quantity zero, remove the item from the cart
        thunkAPI.dispatch(removeFromCart(itemRef));
    } else {
        // Update the quantity of the item in the user's cart in Firestore
        await updateDoc(doc(db, "User", userUID, "MyCart", itemRef), {
            qty: qty - 1
        });
    }
});




//# Purchase all items in Cart
// Here, I delete items one by one from the user's cart and then add them to the MyOrders collection.
export const purchase = createAsyncThunk("myCartActions/purchase", async (_, thunkAPI) => {
    const userUID = thunkAPI.getState().userReducer.userUID;

    // Fetch all items from the user's cart in Firestore
    const querySnapshot = await getDocs(collection(db, "User", userUID, "MyCart"));
    if (querySnapshot.empty) {
        notify("error", "Your Cart is Empty");
        return;
    }

    const allItemsInMyCart = [];

    querySnapshot.forEach(async (doc) => {
        const { name, price, qty } = doc.data();
        allItemsInMyCart.push({ name, price, qty });

        // Remove the item from the user's cart in Firestore
        await thunkAPI.dispatch(removeFromCart(doc.id));
    });

    const today = new Date();
    const day = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

    // Add all purchased items to the MyOrders collection in Firestore
    await addDoc(collection(db, "User", userUID, "MyOrders"), {
        purchaseDate: day,
        itemsList: allItemsInMyCart
    });

    notify("success", "Thanks for shopping with us! Enjoy! 🎉");

    // Clear the cart after purchase
    thunkAPI.dispatch(myCartActions.updateCart([]));
});




export const myCartSlice = createSlice({
    name: "myCartReducer",
    initialState,
    reducers: {
        updateCart: (state, action) => {
            state.cartItems = action.payload
        }
    },
})

export const myCartReducer = myCartSlice.reducer;
export const myCartActions = myCartSlice.actions;