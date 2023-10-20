import NavBar from "./Components/HomePage/Navbar";
import FilterBox from "./Components/HomePage/FilterBox";
import ProductPage from "./Components/HomePage/ProductPage";
import SignInPage from "./Components/UserPage/SignInPage";
import SignUpPage from "./Components/UserPage/SignUpPage"
import MyOrdersPage from "./Components/MyOrdersPage/MyOrdersPage";
import CartPage from "./Components/CartPage/CartPage";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorPage from "./Components/Error/ErrorPage";

function App() {

  const BrowserRouter = createBrowserRouter([
    {
      path: "/",
      element: <NavBar />,
      errorElement: <><NavBar /><ErrorPage /></>,
      children: [
        {
          path: "", element: <FilterBox />, children: [
            { index: true, element: <ProductPage /> }
          ]
        },
        { path: "signin", element: <SignInPage /> },
        { path: "signup", element: <SignUpPage /> },
        { path: "myOrders", element: <MyOrdersPage /> },
        { path: "cart", element: <CartPage /> },
      ]
    }
  ])


  return (<>
    <RouterProvider router={BrowserRouter} />
    <ToastContainer />
  </>)
}

export default App;