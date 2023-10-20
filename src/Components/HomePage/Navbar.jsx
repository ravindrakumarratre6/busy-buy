import css from "./Css/NavBar.module.css"
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { notify } from "../../Components/Notify/notify";
import { logOut, signIn } from "../../Redux/Reducers/userReducer";
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from "../../Redux/selectors";

export default function NavBar() {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const userUID = useSelector(userSelector);


    const handleLogOut = async (e) => {
        e.preventDefault();
        dispatch(logOut());
        notify("success", "Log-out Successful");
        navigate("/");
    }
    return (
        <>
            <div className={css.navBar}>
                <div className={css.icon}>
                    <img src="https://cdn-icons-png.flaticon.com/512/3744/3744228.png" alt="" />
                    <span>BuyBuy</span>
                </div>
                <div className={css.buttons}>
                    <NavLink to={"/"}>
                        <div className={css.btn}>
                            <img src="https://cdn-icons-png.flaticon.com/512/10473/10473299.png" alt="" />
                            <h2>Home</h2>
                        </div>
                    </NavLink>
                    {userUID &&
                        <>
                            <NavLink to={"/myOrders"}>
                                <div className={css.btn}>
                                    <img src="https://cdn-icons-png.flaticon.com/512/1376/1376362.png" alt="" />
                                    <h2>MyOrder</h2>
                                </div>
                            </NavLink>
                            <NavLink to={"/cart"}>
                                <div className={css.btn}>
                                    <img src="https://cdn-icons-png.flaticon.com/512/6145/6145556.png" alt="" />
                                    <h2>Cart</h2>
                                </div>
                            </NavLink>
                            <NavLink onClick={(e) => handleLogOut(e)}>
                                <div className={css.btn}>
                                    <img src="https://cdn-icons-png.flaticon.com/512/1348/1348448.png" alt="" />
                                    <h2>LogOut</h2>
                                </div>
                            </NavLink>
                        </>}
                    {!userUID &&
                        <NavLink to={"/signin"}>
                            <div className={css.btn}>
                                <img src="https://cdn-icons-png.flaticon.com/512/1348/1348464.png" alt="" />
                                <h2>LogIn</h2>
                            </div>
                        </NavLink>
                    }
                </div>
            </div>
            <Outlet />
        </>
    )
}

