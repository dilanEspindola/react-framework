import { rspack } from "@rspack/core";
import ReactRefreshPlugin from "@rspack/plugin-react-refresh";
import { watch, readdirSync, writeFile } from "fs";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

const env = "development";

/** @type {import('@rspack/cli').Configuration} */
export default {
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      "@/": path.resolve(import.meta.dirname, "src/"),
    },
  },
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
    filename: `${env === "development" ? "[name].js" : "[name].[contenthash].js"}`,
    chunkFilename: `${env === "development" ? "[name].js" : "[name].[contenthash].js"}`,
    assetModuleFilename: "[name].[contenthash][ext]",
    clean: true,
  },
  devServer: {
    port: 3000,
    // static: {
    //   directory: path.resolve(import.meta.dirname, "dist"),
    // },
    proxy: [
      {
        context: ["/"],
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    ],
    setupMiddlewares: (middlewares, _devServer) => {
      const pagesDir = path.resolve(import.meta.dirname, "src/pages");
      const routeMap = new Map();

      const generateRouteFile = () => {
        const readAllFiles = (pagesDir) => {
          if (!pagesDir) return;

          const content = readdirSync(pagesDir, { encoding: "utf-8" });

          content.forEach((element) => {
            const pathEl = path.join(pagesDir, element);
            if (pathEl.includes("page.tsx")) {
              const url = pathEl.split("src")[1];
              const fullPath = path.join("./src", url.replace(/\\/g, "/"));
              const keyDirPath = url
                .split("pages")[1]
                .split("page.tsx")[0]
                .replace(/\\/g, "/");

              routeMap.set(keyDirPath, fullPath);
            } else {
              readAllFiles(pathEl);
            }
          });
        };
        readAllFiles(pagesDir);

        const entries = Object.fromEntries(routeMap);

        const jsObject = `export const routes = ${JSON.stringify(entries, null, 2)}`;

        writeFile(`${import.meta.dirname}/src/routes.ts`, jsObject, (err) => {
          if (err) throw new Error("Error writing file: " + err);

          console.log("file written successfully");
        });
      };

      generateRouteFile();

      watch(pagesDir, { recursive: true }, (evenType, filename) => {
        console.log(`File ${filename} was ${evenType}`);
        generateRouteFile();
      });

      return middlewares;
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
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            sourceMap: true,
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
                  refresh: env === "development",
                  development: env === "development",
                },
              },
            },
          },
        },
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        type: "css/auto",
        parser: { namedExports: false },
        options: {
          modules: true,
        },
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
            transform: {
              react: {
                runtime: "automatic",
                refresh: env === "development",
                development: env === "development",
              },
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
