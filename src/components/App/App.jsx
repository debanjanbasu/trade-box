import React from "react";
import styles from "./App.scss";
import Header from "../Header/Header.jsx";
import Main from "../Main/Main.jsx";
import Footer from "../Footer/Footer.jsx";

export default class App extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                <Header />
                <Main />
                <Footer />
            </div>
        );
    }
}
