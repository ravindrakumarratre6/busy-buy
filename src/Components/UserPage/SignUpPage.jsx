import React, { useRef } from 'react';
import css from "./css/SignInPage.module.css";
import { NavLink, useNavigate } from 'react-router-dom';
import { notify } from "../../Components/Notify/notify";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../Firebase/Firebase';

export default function LoginPage() {
    const navigate = useNavigate();

    // Refs to store name, email, and password input elements
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();


    // Function to handle form submission
    const onSubmit = (e) => {
        e.preventDefault();
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;


        // Sign up new users with email and password using Firebase Auth
        createUserWithEmailAndPassword(auth, email, password)
            .then(async () => {
                // Update the user's display name after successful sign-up
                await updateProfile(auth.currentUser, {
                    displayName: name
                });

                // Save the email and password in localStorage for persistence
                localStorage.setItem("email", email);
                localStorage.setItem("password", password);

                // Navigate to the sign-in page after successful sign-up
                navigate("/signin");
            })
            .catch((error) => {
                const errorMessage = error.message;
                notify("error", errorMessage);
            });
    };


    return (
        <div className={css.LoginPageContainer}>
            <div className={css.formBorderContainer}>
                <div className={css.formContainer}>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <h2>Name</h2>
                        <input ref={nameRef} type="text" placeholder='Please Enter Your Name here' maxLength={15} required />
                        <h2>UserName</h2>
                        <input ref={emailRef} type="email" placeholder='Please Enter Email here' required />
                        <h2>Password</h2>
                        <input ref={passwordRef} type="password" placeholder='Please Enter Password here' minLength={6} required />
                        <br />
                        <button>Sign-Up</button>
                    </form>
                    <NavLink to={"/signin"}>Already have an account? Sign-In here</NavLink>
                </div>
            </div>
        </div>
    );
}
