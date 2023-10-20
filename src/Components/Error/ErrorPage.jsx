import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import css from "./ErrorPage.module.css";
import { notify } from "../../Components/Notify/notify";

export default function ErrorPage() {
    const navigate = useNavigate();


    useEffect(() => {
        // Show an informational notification to the user that the page will redirect to the previous page after 10 seconds
        notify("info", "Page will Redirect To Previous Page after 10 sec ");

        // Set up a timer to automatically navigate back to the previous page after 10 seconds
        setTimeout(() => {
            navigate(-1); // Navigates back to the previous page
        }, 10000); // 10 seconds

        // The empty dependency array ensures that this effect runs only once when the component mounts
    }, [navigate]);


    return (
        <section className={css.page_404}>
            <div className={css.four_zero}>
                <h1 className={css['text-center']}>404</h1>
            </div>
            <div>
                <h3>
                    Look like you're lost
                </h3>
                <p>The page you are looking for is not available!</p>

                {/* NavLink to the Home page */}
                <NavLink to="/" className={css.link_404}>Go to Home</NavLink>
            </div>
        </section>
    );
}
