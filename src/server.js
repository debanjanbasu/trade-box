import express from "express";
import ejs from "ejs";
import path from "path";
import { renderToStaticMarkup } from "react-dom/server";
import App from "./components/App/App.jsx";
import { StaticRouter } from "react-router";
// add normalize at global level
import "./normalize.scss";

// server port
const port = 3000;

// initialize the server and configure support for ejs templates
const app = new express();
// set html as the view engine parser for html files
app.engine(".html", ejs.__express);
app.set("view engine", "html");
// set the root as views directory
app.set("views", path.resolve("dist"));
// set the static path for content generation
app.use(
    express.static(path.resolve("dist"), {
        // we do not want to server index.html directly
        index: false
    })
);

app.get("*", async (req, res) => {
    const context = {};
    const markup = await renderToStaticMarkup(
        <StaticRouter location={req.url} context={context}>
            <App />
        </StaticRouter>
    );
    if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        res.redirect(301, context.url);
    } else {
        // we're good, send the response
        res.render("index", {
            markup
        });
    }
});

// start listening
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
