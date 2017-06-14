import React from "react";
import styles from "./Main.scss";
import { Route, Switch } from "react-router";
import Home from "../Home/Home.jsx";
import MyMessages from "../MyMessages/MyMessages.jsx";
import MyAccount from "../MyAccount/MyAccount.jsx";

export default class Main extends React.Component {
    render() {
        return (
            <main className={styles.main}>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/mymessages" component={MyMessages} />
                    <Route path="/myaccount" component={MyAccount} />
                </Switch>
            </main>
        );
    }
}
