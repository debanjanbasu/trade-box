import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
// Add normalize at global level
// ensure normalize is loaded before
// other component styles
import "./normalize.scss";
// The main App component
import App from "./components/App/App.jsx";

// Initialize webpack offline plugin
// This is actually not needed in development
import * as OfflinePluginRuntime from "offline-plugin/runtime";
OfflinePluginRuntime.install();

render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById("root")
);
