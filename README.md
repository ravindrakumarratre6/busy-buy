# Topics

* [**Installation of Redux**](#installation-of-redux)
* [**Reducers**](#reducer)
* [**Action**](#action)
* [**Store**](#store)
* [**Provider Component**](#provider-component)
* [**Dispatchers**](#usedispatch)
* [**useSelector & getState()**](#useselector--getstate)
* [**state in reducer-slice vs state in components**](#state-in-reducer-slice-vs-state-in-components)
* [**createAsyncThunk**](#createasyncthunk)
* [**thunkAPI**](#thunkapi)



# Installation of Redux
```javascript
npm install react-redux
```
## Reducer
In the context of Redux, a reducer is a pure function that specifies how the application's state changes in response to dispatched actions. It is one of the core concepts of Redux and plays a central role in managing the state of your application.

A reducer takes two arguments: the current state and an action. The state represents the current state of your application, and the action is a plain JavaScript object that describes the type of change you want to make to the state. The reducer then calculates the new state based on the action and returns the updated state.

**The initial state** is provided as the default value for the state argument: When the Redux store is first created or when an unknown action type is dispatched, the reducer returns the initial state.

* **Reducer Syntax in React-Redux (Traditional Redux):**
In traditional Redux with **react-redux**, reducers are defined as pure functions that take the current state and an action as arguments and return a new state based on the action's type and payload. The reducer function is responsible for handling different action types and updating the state accordingly.

**the "state" refers to the current state of the specific reducer's slice, not the entire store state.**

 when you define a slice using the createSlice function, you are creating a specific slice reducer that will manage a portion of the overall store state. The state parameter inside the reducer functions of this slice refers to the current state of that specific slice, not the entire store state.
```js
const initialState = {
  user: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SOME_ACTION_TYPE':
      // Calculate and return the updated state based on the action
      return {
        ...state,
        // Update specific properties of the state
      };
    case 'ANOTHER_ACTION_TYPE':
      // Calculate and return the updated state based on the action
      return {
        ...state,
        // Update other properties of the state
      };
    default:
      // If the action doesn't match any known action type, return the current state
      return state;
  }
};

export default userReducer;
```
* **Reducer Syntax in Redux-Toolkit: createSlice Function**

   With **@reduxjs/toolkit**, reducers are defined using the createSlice function, which significantly reduces the boilerplate compared to traditional Redux. The createSlice function generates action creators and automatically creates the corresponding reducer functions.

```js
const initialState = {
  user: null,
};

import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export const userReducer = userSlice.reducer;

```
The createSlice function takes an object as its argument with the following properties:

**name**: The name of the slice, which is used to generate the action types automatically. In this case, the slice is named 'user'.

**initialState**: The initial state of the slice. In this case, the user property is set to null initially.

**reducers**: An object that contains reducer functions. These reducer functions handle different actions and modify the state accordingly. In this case, the setUser and logoutUser reducers are defined.

 #### (state,action)=>{}

 * **state**
   The state in Redux should be treated as immutable. This means that you should not directly modify the state. Instead, you create a new state object that reflects the desired changes based on the current state and the dispatched action.

* **action**
 An "action" is a plain JavaScript object that represents an intention to change the state. It is the only way to communicate with the Redux store to update the state. An action must have a type property, which indicates the type of action being performed, and it can also have additional data called "payload," which contains any necessary information to update the state.

---

## Action

   In Redux, "actions" represent an intention to change the state of your application. An action is a plain JavaScript object that describes what happened or what event occurred in your application. Actions are the only way to communicate with the Redux store and trigger updates to the state.

   Actions must have a type property that describes the type of action being performed. The type property is usually defined as a string, but it can be any value that uniquely identifies the action. By convention, action type strings are written in uppercase and often use snake_case or UPPERCASE_SNAKE_CASE.

   **a simple action object**
   ```js
   const setUserAction = {
  type: 'SET_USER',
  payload: {
    name: 'John',
    age: 30,
  },
};
 ```

 In **react-redux**, action objects are created using "action creators." Action creators are functions that return action objects, encapsulating the logic of creating actions and making it easier to dispatch actions from different parts of the application.
```js
// Action Creator
const setUser = (userData) => {
  return {
    type: 'SET_USER',
    payload: userData,
  };
};

// Dispatching the action
dispatch(setUser({ name: 'John', age: 30 }));
```
In **@reduxjs/toolkit**, action objects are automatically generated when using the createSlice function. The createSlice function defines reducer functions, along with their corresponding action types and action creators.
```js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {...},
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;

// Dispatching the action
dispatch(setUser({ name: 'John', age: 30 }));
```
**internally it looks like**
```js
// The automatically generated userSlice.actions object
const actions = {
  setUser: (state, action) => { ... },
};
```

In both cases, setUser is the action creator (manually created in the react-redux example and automatically generated by @reduxjs/toolkit). The action creator returns an action object that can be dispatched to the Redux store to update the state.

---

## Store
  The store is a central component in Redux that holds the entire state tree of your application. It represents a single source of truth and is responsible for managing the state and handling state updates in a predictable and consistent manner. The store is created using the createStore function provided by the Redux library.

  Redux uses a single store with a single root reducer that may be composed of multiple smaller reducers (commonly referred to as "slice reducers"). These slice reducers manage specific parts of the application state, and the root reducer combines them into the overall state tree.

  * **using react-redux**
 ```javascript
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { userReducer } from "./Reducers/userReducer";
import { productsReducer } from "./Reducers/productsReducer";
import { myCartReducer } from "./Reducers/myCartReducer";

// Combine your reducers into a single root reducer
const rootReducer = combineReducers({
  user: userReducer,
  products: productsReducer,
  myCart: myCartReducer,
});

// Create the Redux store using createStore and the root reducer
const store = createStore(rootReducer);

export default store;

 ```
* **using redux/toolkit**
```javascript
import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from "./reducers/userSlice";
import { productsReducer } from "./reducers/productsSlice";
import { myCartReducer } from "./reducers/myCartSlice";

// Use configureStore to create the Redux store
const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
    myCart: myCartReducer,
  },
});

export default store;
```

## Provider Component

  The Provider is a higher-order component provided by the react-redux library, which integrates Redux with React applications. The Provider component wraps the root of your React component tree and makes the Redux store accessible to all the components in your application without having to pass it explicitly through props. It ensures that any changes to the state in the Redux store automatically trigger re-renders of the relevant components that are connected to the store.
```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App'; // Your root component
import store from './store'; // Your Redux store created with configureStore

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

```
---
## useDispatch

The syntax of using the dispatcher in both **react-redux** and **@reduxjs/toolkit** is quite similar since both libraries use the same fundamental concept of Redux.

you can use the useDispatch hook to get the dispatch function, which you can then use to dispatch actions to the Redux store
```js
// Example: Dispatching an action to update the user data in the Redux store using Redux Toolkit
import { useDispatch } from 'react-redux';
import { setUser } from './path-to-slice'; // Import the slice instead of action creators

const UpdateUser = () => {
  const dispatch = useDispatch();

  const handleUpdate = () => {
    const userData = { name: 'John Doe', age: 30 };
    dispatch(setUser(userData));
  };

  return (
    <button onClick={handleUpdate}>Update User</button>
  );
};

```

---
 # useSelector &  getState():
 **getState()** is not a hook but a method available on the Redux store object when using traditional Redux. It allows you to directly access the entire store state, and you typically use it within the context of Redux middleware, or when you have access to the store object.

 ```js
 const userState = store.getState().user;
 ```

To get data in any component, we need to export the store, but it's a bad idea. So, we can use useSelector(), where we would have to import the store to use store.getState(). However, with useSelector(), we can work without importing the store.

In the callback function of useSelector(), you will get access to the state property/object of the store. Even with store.getState(), we were getting the state object. So, without importing the store, we can access the state object.

 **When you use the useSelector hook in a functional component to access specific data from the Redux store, React Redux automatically subscribes your component to updates for that particular data. If the data in the Redux store changes, your component will be re-rendered with the updated values, and you don't need to use useEffect explicitly to trigger the update.**

Here's how it works:

* When you use useSelector, React Redux internally keeps track of which parts of the Redux store your component is interested in based on the selector function you provide.

* Whenever an action is dispatched that modifies the relevant part of the Redux store, React Redux will compare the previous and new values of the selected data.

* If the selected data has changed (according to a shallow equality check), React Redux will re-render your component with the updated data.

Here's an example to illustrate this behavior:

```javascript
import React from 'react';
import { useSelector } from 'react-redux';

const MyComponent = () => {
  // Access the 'count' state from the Redux store
  const count = useSelector((state) => state.counter.count);

  // 'count' will automatically be updated whenever the 'count' state in the Redux store changes

  return (
    <div>
      <h1>Count: {count}</h1>
    </div>
  );
};

```
**or**
```javascript
const userUid = useSelector(userSelector);
const userUid = useSelector(userSelector(state));//wrong
```
```js
export const userSelector = (state) => state.userReducer.userUID;
```
**useSelector** takes the corresponding selector functions (userSelector, myCartSelector) as arguments and internally passes the **current state of the store** to these selector functions

---
## state in reducer-slice vs state in components

 In the reducer function created by createSlice, you have direct access to the state related to that specific slice (in this case, the userReducer slice). The state parameter passed to the reducer function represents the entire state of that slice.

 So, inside the reducer function, you can directly access and modify the userUID state using state.userUID, like this:

```javascript
const initialState = {
    userUID: null
};

const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    // Your other reducers...
  },
  extraReducers: (builder) => {
    // Handle extra reducers here
    builder.addCase("someOtherAction", (state, action) => {
      // Accessing userUID directly within this slice's state
      state.userUID = "someValue";
    });
  },
});
```

On the other hand, when you want to access the userUID state in a component, you need to use useSelector because components don't have direct access to the Redux store or its state.

To access the userUID state in a component using useSelector, you define a selector function that takes the entire Redux store state as an argument and returns the specific part of the state related to userReducer. Then, you use useSelector with that selector function to extract the userUID state.

```javascript
import { useSelector } from "react-redux";
import { userSelector } from "../path/to/userSelector"; // Import the selector

const MyComponent = () => {
  const userUID = useSelector(userSelector); // Use the selector

  // Use 'userUID' in your component
  return (
    <div>
      <h1>User UID: {userUID}</h1>
    </div>
  );
};
```
---
# createAsyncThunk

createAsyncThunk is a utility provided by Redux Toolkit to handle asynchronous actions in Redux. It simplifies the process of dispatching asynchronous actions and provides built-in support for three lifecycle status types: "pending" (when the async action is initiated), "fulfilled" (when the async action is successfully resolved), and "rejected" (when the async action encounters an error).

When you define a createAsyncThunk, you pass two arguments:

The first argument is a string that represents the type prefix for the async thunk. This string is used as a base to generate action types for each lifecycle status.

The second argument is an async function that performs the actual asynchronous operation (e.g., making an API call) and returns a promise with the result.
```js
export const getInitialState = createAsyncThunk("todo/getInitialState", (payload,thunkAPI) => {
  // This return value will become action.payload of the fulfilled action
  return axios.get("http://localhost:4100/api/todos");
});
```
The first argument is "todo/getInitialState", which is the type prefix for the async thunk, and the second argument is the async function that fetches data from the API.

#### Action Type Generation:

When you use createAsyncThunk, Redux Toolkit automatically generates action types for the async thunk based on the provided type prefix and the lifecycle status. For the async thunk "todo/getInitialState," it will generate three action types:

**"todo/getInitialState/pending"**: Represents the action dispatched when the async operation is initiated (e.g., before the API call).

**"todo/getInitialState/fulfilled"**: Represents the action dispatched when the async operation is successfully resolved (e.g., after the API call is successful).

**"todo/getInitialState/rejected"**: Represents the action dispatched when the async operation encounters an error (e.g., if the API call fails).

#### Action Creator Functions:
When you use createAsyncThunk, it also generates action creator functions for each lifecycle status. These action creator functions allow you to dispatch the corresponding action to the Redux store.

For example, for the async thunk "todo/getInitialState," createAsyncThunk generates the following action creator functions:

**getInitialState.pending**: The action creator function for the "pending" status. You can use this to dispatch the "todo/getInitialState/pending" action.

**getInitialState.fulfilled**: The action creator function for the "fulfilled" status. You can use this to dispatch the "todo/getInitialState/fulfilled" action.

**getInitialState.rejected**: The action creator function for the "rejected" status. You can use this to dispatch the "todo/getInitialState/rejected" action.

```js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getInitialState = createAsyncThunk("todo/getInitialState", async () => {
  const response = await axios.get("http://localhost:4100/api/todos");
  return response.data; // Assuming the response data is an array of todos
});

// Example: Dispatching actions using the generated action creator functions

// Dispatch the "pending" action
dispatch(getInitialState.pending());

// Dispatch the "fulfilled" action with the payload (data from the resolved promise)
dispatch(getInitialState.fulfilled({ data: [{ id: 1, text: 'Todo item' }] }));

// Dispatch the "rejected" action with the error payload (error from the rejected promise)
dispatch(getInitialState.rejected({ error: 'Error message' }));
```

**different ways to reference the fulfilled action type in extraReducers for a createAsyncThunk in Redux Toolkit.**

```javaScript
const todoSlice = createSlice({
  name: 'todo',
  initialState: initialState,
  reducers: {
    // ...
  },
  extraReducers: (builder) => {
    builder.addCase(getInitialState.fulfilled, (state, action) => {
      state.todos = [...action.payload.data];
    });
  },
});
```
In this approach, you reference the fulfilled action type using the action creator function getInitialState.fulfilled. Redux Toolkit automatically generates the action types for the createAsyncThunk based on the thunk name ("todo/getInitialState" in this case) and the lifecycle status ("fulfilled" for the resolved state). Using the action creator function makes the code more maintainable because it ensures that you are using the correct action type in your reducer, and it prevents accidental typos in the string.

**Using the action type string directly**
```js
export const getInitialState = createAsyncThunk("todo/getInitialState", (_) => {
  return axios.get("http://localhost:4100/api/todos");
});

const todoSlice = createSlice({
  name: 'todo',
  initialState: initialState,
  reducers: {
    // ...
  },
  extraReducers: (builder) => {
    builder.addCase("todo/getInitialState/fulfilled", (state, action) => {
      state.todos = [...action.payload.data];
    });
  },
});
```
In this approach, you directly reference the action type string "todo/getInitialState/fulfilled". While this works, using the string directly can be more error-prone, as it is prone to typos and can be harder to maintain in the long run.

In both cases, the extraReducers block listens for the fulfilled action of the createAsyncThunk (getInitialState) and updates the todos state in the Redux store with the fetched data when the API call is successful.

in this example, createAsyncThunk will automatically dispatch the "pending" action when the getInitialState async thunk is initiated, and it will dispatch the "fulfilled" action with the resolved data when the promise is successfully resolved.

By using the action creator function, you get the following benefits:

**Type Safety**: Since the action creator function is generated by Redux Toolkit, it ensures that you are using the correct action type in your reducer. The action creator function knows the exact action type ("todo/getInitialState/fulfilled") to dispatch, so you don't have to manually write the action type string, reducing the risk of typos or mistakes.

**Refactoring**: If you ever change the type prefix or the lifecycle status names for the async thunk, the action creator functions will be automatically updated, ensuring that you're always using the correct action types, even if you refactor your code.

**Readability and Maintainability**: Using the action creator function makes your code more readable and maintainable. It's easier to understand what the action does when you see getInitialState.fulfilled compared to a manually written action type string like "todo/getInitialState/fulfilled".

---

### thunkAPI
**thunkAPI** is an object provided by Redux Toolkit to async thunks (functions created with createAsyncThunk). It contains useful utilities and information that can be used inside the async thunk function.

The thunkAPI object has the following properties:

**dispatch**: A function that allows you to dispatch actions from within the async thunk. You can use it to dispatch other actions or even other async thunks. **thunkAPI.dispatch(action(payload))**

**getState**: A function that allows you to access the current Redux state. You can use it to retrieve the current state of the store and use it in your async thunk logic. **thunkAPI.getState()**

**extra**: An optional property where you can access any extra argument or configuration you passed to createAsyncThunk as the extraReducers argument. This can be useful for accessing additional data or services required for your async operation.
