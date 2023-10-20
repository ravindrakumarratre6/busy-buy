import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";

// Import statements...

const initialState = {
    products: [],
    filter: {
        priceRange: 90000,
        options: []
    }
}



// Fetch initial products from Firestore
export const initialProductsRendering = createAsyncThunk("productsReducer/initialProducts", async (payload, thunkAPI) => {
    const querySnapshot = await getDocs(collection(db, "Products"));
    const newProducts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    thunkAPI.dispatch(productsAction.updateProducts(newProducts));
});


//~-------------------------------- Filtering Results--------------------------------

// Helper function to get products based on options and price range
//this function `getProducts` is a helper function it will used by  `filterProducts` and `KeyWordFilter`,
//here i first fetch product on the basic of category, then filter(compair) them locally on the basic of priceRange

async function getProducts(options, priceRange) {
    // Initialize an empty array to hold the filtered products
    let filteredProducts = [];

    // Apply price range filter
    const priceQuerySnapshot = await getDocs(
        query(collection(db, "Products"), where("price", "<=", parseInt(priceRange)))
    );
    filteredProducts = priceQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    // Apply category filter if there are any options selected
    if (options.length > 0) {
        const categoryQuerySnapshot = await getDocs(
            query(collection(db, "Products"), where("category", "in", options))
        );
        const categoryFilteredProducts = categoryQuerySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Merge the category filtered products with the previously filtered products
        filteredProducts = filteredProducts.filter((product) =>
            categoryFilteredProducts.some((item) => item.id === product.id)
        );
    }
    return filteredProducts;
}




// Filter products based on keyword search
//## Take User Filtring preference from input Type text(string or number);
//if you type any number it will search product with price less then or equal to that number,
//if you type any text then it will search on the basic of product name and its category

export const KeyWordFilter = createAsyncThunk("productsReducer/KeyWordFilter", async (payload, thunkAPI) => {
    // Convert the search text to uppercase for case-insensitive search
    const text = payload.toUpperCase();

    // Get the filter options from the Redux state
    const { options, priceRange } = thunkAPI.getState().productsReducer.filter;

    // Fetch products based on the filter options and price range
    const newProducts = await getProducts(options, priceRange);

    // Filter products based on the keyword search text
    const newFilteredProducts = newProducts.filter((product) =>
        product.category.toUpperCase().includes(text) ||
        product.name.toUpperCase().includes(text) ||
        product.price <= (parseInt(text))
    );

    // Update the Redux state with the filtered products
    thunkAPI.dispatch(productsAction.updateProducts(newFilteredProducts));
});




// Filter products based on user preferences (price range and checkboxes)
//Here i take user input, then filter and update products result on the basic of user preference, such as price, type

export const filterProducts = createAsyncThunk("productsReducer/filterProducts", async (e, thunkAPI) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const name = e.target.name;

    // Get the current filter from the Redux state
    let newFilter = thunkAPI.getState().productsReducer.filter;
    let newFilteredProducts = [];

    if (name === "seekbar") {
        // Update the price range in the filter
        newFilter = {
            ...newFilter,
            priceRange: value,
        }
        // Fetch products based on the updated filter
        newFilteredProducts = [...await getProducts(newFilter.options, value)]
    } else if (value) {
        // Add an option to the filter if it is selected
        newFilter = {
            ...newFilter,
            options: [...newFilter.options, name]
        }
        // Fetch products based on the updated filter
        newFilteredProducts = [...await getProducts([...newFilter.options], newFilter.priceRange)];
    } else {
        // Remove an option from the filter if it is deselected
        newFilter = {
            ...newFilter,
            options: newFilter.options.filter((option) => option !== name)
        }
        // Fetch products based on the updated filter
        newFilteredProducts = [...await getProducts(newFilter.options, newFilter.priceRange)];
    }

    // Return the filtered products and updated filter as the result of the thunk
    return {
        newFilteredProducts,
        newFilter
    };
});




export const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        updateProducts: (state, action) => {
            state.products = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(filterProducts.fulfilled, (state, action) => {
            state.products = action.payload.newFilteredProducts;
            state.filter = action.payload.newFilter;
        })
    }
})


export const productsReducer = productsSlice.reducer;
export const productsAction = productsSlice.actions;
