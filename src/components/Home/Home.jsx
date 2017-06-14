import React from "react";
import styles from "./Home.scss";

export default class Home extends React.Component {
    render() {
        return (
            <div className={styles.home}>
                <form>
                    <label>
                        Search Item:
                        <input type="text" />
                    </label>
                    <input type="submit" value="Search" className={styles.btnPrimary}/>
                </form>
            </div>
        );
    }
}
