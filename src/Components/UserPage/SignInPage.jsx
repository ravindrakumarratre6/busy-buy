import React, { useRef, useEffect } from 'react';
import css from "./css/SignInPage.module.css";
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signIn } from '../../Redux/Reducers/userReducer';

export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    // Refs to store email and password input elements
    const emailRef = useRef("");
    const passwordRef = useRef();



    useEffect(() => {
        // Populate the email and password fields with the values from localStorage, if available
        emailRef.current.value = localStorage.getItem("email") || "";
        passwordRef.current.value = localStorage.getItem("password") || "";
    }, []);



    // Function to handle form submission
    const onSubmit = async (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        // Dispatch the signIn action with user credentials
        dispatch(signIn({ email, password }));

        // Save the email and password in localStorage for persistence
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);

        // Navigate to the home page after successful sign-in
        navigate("/");
    };

    return (
        <div className={css.LoginPageContainer}>
            <div className={css.formBorderContainer}>
                <div className={css.formContainer}>
                    <form action="" onSubmit={(e) => onSubmit(e)}>
                        <h2>Email</h2>
                        <input ref={emailRef} type="email" placeholder='Please Enter Email here' />
                        <h2>Password</h2>
                        <input ref={passwordRef} type="password" placeholder='Please Enter Password here' />
                        <br />
                        <button>Sign-In</button>
                    </form>
                    <NavLink to={"/signup"}>New User? SignUp here</NavLink>
                </div>
            </div>
        </div>
    );
}
