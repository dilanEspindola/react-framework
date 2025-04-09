import { rspack } from "@rspack/core";
import ReactRefreshPlugin from "@rspack/plugin-react-refresh";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

const env = "production";

/** @type {import('@rspack/cli').Configuration} */
export default {
  mode: env,
  experiments: {
    css: true,
  },
  node: {
    global: true,
  },
  entry: { main: "./src/index.tsx" },
  output: {
    path: path.resolve(import.meta.dirname, "dist"),
    publicPath: "/",
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    assetModuleFilename: "[name].[contenthash][ext]",
    clean: true,
  },
  devServer: {
    port: 3000,
    static: {
      directory: path.resolve(import.meta.dirname, "dist"),
    },
  },
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: "all",
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "ecmascript",
                jsx: true,
              },
              transform: {
                react: {
                  runtime: "automatic",
                  pragma: "React.createElement",
                  pragmaFrag: "React.Fragment",
                  refresh: env === "development",
                  development: env === "development",
                },
              },
            },
          },
        },
        type: "javascript/auto",
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
                decorators: true,
                dynamicImport: true,
              },
              transform: {
                react: {
                  runtime: "automatic",
                  pragma: "React.createElement",
                  pragmaFrag: "React.Fragment",
                  refresh: env === "development",
                  development: env === "development",
                },
              },
            },
          },
        },
        type: "javascript/auto",
      },
      // {
      //   test: /\.css$/i,
      //   use: [rspack.CssExtractRspackPlugin.loader, "css-loader"],
      //   type: "javascript/auto",
      // },
      {
        test: /\.css$/i,
        type: "css/auto",
        parser: { namedExports: false },
      },
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
              decorators: true,
              dynamicImport: true,
            },
          },
        },
        type: "javascript/auto",
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|bmp|ico|woff2?|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({ template: "./index.html", minify: true }),
    env === "development" && new ReactRefreshPlugin(),
    env === "development" && new rspack.HotModuleReplacementPlugin(),
  ],
};
