import React from "react";
import styles from "./Header.scss";
import { Link } from "react-router-dom";

export default class Header extends React.Component {
    render() {
        return (
            <header className={styles.header}>
                <Link to="/mymessages">10</Link>
                <Link to="/myaccount">My Account</Link>
            </header>
        );
    }
}
