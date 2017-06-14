const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const GoogleFontsWebpackPlugin = require("google-fonts-webpack-plugin");
const OfflinePlugin = require("offline-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

// For favicons and webapp manifest files
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const WebappManifest = require("webapp-manifest-plugin");
const WebappManifestPlugin = WebappManifest.default;
const FAVICON_PLUGIN = WebappManifest.FAVICON_PLUGIN;
const manifestConfig = {
    name: "Trade Box",
    shortName: "TB",
    description: "Trade Box your items and abracadabra it's sold",
    dir: "auto",
    lang: "en-US",
    display: "standalone",
    orientation: "any",
    startUrl: "/",
    backgroundColor: "#fff",
    themeColor: "#fff",
    icons: FAVICON_PLUGIN,
    preferRelatedApplications: false,
    relatedApplications: [],
    scope: "/"
};

// this is the source and dist directory
const srcDir = path.resolve("src");
const distDir = path.resolve("dist");
const buildEnvironment = process.env.NODE_ENV;

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: `${srcDir}/index.html`,
    filename: "index.html",
    inject: "body"
});

const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    // extract the css only in production
    disable: buildEnvironment === "development",
    allChunks: true,
    ignoreOrder: true
});

// the path(s) that should be cleaned
const pathsToClean = ["dist"];

const commonLoaders = [
    {
        test: /\.(js|jsx)$/,
        loaders: ["react-hot-loader/webpack", "babel-loader"],
        exclude: /node_modules/
    },
    {
        test: /\.scss$/,
        use: extractSass.extract({
            use: [
                {
                    loader: "css-loader",
                    options: {
                        // generate sourcemaps only in dev
                        sourceMap: buildEnvironment === "development",
                        modules: true,
                        // max hash of 6 characters
                        localIdentName: "[name]__[local]--[hash:base64:6]",
                        // for enabling support of BEM based css in our project
                        camelCase: true,
                        minimize: true,
                        import: false
                    }
                },
                {
                    loader: "sass-loader",
                    options: {
                        // generate sourcemaps only in dev
                        sourceMap: buildEnvironment === "development"
                    }
                }
            ],
            // use style-loader in development
            fallback: "style-loader"
        })
    }
];

const commonPlugins = [
    new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(buildEnvironment)
    }),
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
    }),
    // basically it will build the CSS twice, but needs to do for the moment
    // this allows to have a perfectly styled webpage in the first response
    extractSass
];

const clientWebpackConfig = {
    entry: {
        main: `${srcDir}/index.js`
    },
    devServer: {
        // server index.html by default in dev server
        historyApiFallback: true,
        // try to gzip the content
        compress: true
    },
    output: {
        path: distDir,
        filename: "[name]-[hash].js",
        chunkFilename: "[name]-[chunkhash].js",
        // The plugin for manifest generation depend on this
        publicPath: ""
    },
    module: {
        loaders: [
            ...commonLoaders,
            {
                test: /\.html$/,
                loader: "html-loader",
                options: {
                    minimize: true
                }
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: ({ resource }) => /node_modules/.test(resource)
        }),
        ...commonPlugins,
        new FaviconsWebpackPlugin({
            // source logo
            logo: __dirname + "/trade-box.png",
            persistentCache: true,
            background: "#fff",
            title: "Trade Box"
        }),
        new WebappManifestPlugin(manifestConfig),
        HtmlWebpackPluginConfig,
        new GoogleFontsWebpackPlugin({
            fonts: [{ family: "Open Sans Condensed", variants: ["300"] }],
            local: buildEnvironment === "production"
        }),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: "defer"
        })
    ]
};

// This is the backend webpack plugin
const serverWebpackConfig = {
    entry: `${srcDir}/server.js`,
    target: "node",
    // do not bundle node_modules
    externals: [nodeExternals()],
    output: {
        path: distDir,
        filename: "server-[name]-[hash].js",
        chunkFilename: "[name]-[chunkhash].js"
    },
    module: {
        loaders: commonLoaders
    },
    plugins: commonPlugins
};

// Plugins only for production
if (buildEnvironment === "production") {
    clientWebpackConfig.plugins.push(new OfflinePlugin());
    // clean the build folder
    clientWebpackConfig.plugins.push(new CleanWebpackPlugin(pathsToClean));
    // Export both client and server configs
    module.exports = [
        Object.assign({}, clientWebpackConfig),
        Object.assign({}, serverWebpackConfig)
    ];
} else if (buildEnvironment === "development") {
    module.exports = [Object.assign({}, clientWebpackConfig)];
}
