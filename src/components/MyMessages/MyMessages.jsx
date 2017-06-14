import React from "react";
import styles from "./MyMessages.scss";

export default class MyMessages extends React.Component {
    render() {
        return (
            <div className={styles.messages}>
                I am from My Messages
            </div>
        );
    }
}
