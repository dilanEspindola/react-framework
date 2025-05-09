import { rspack } from "@rspack/core";
import ReactRefreshPlugin from "@rspack/plugin-react-refresh";
import {
  watch,
  readdirSync,
  writeFile,
  readFileSync,
  existsSync,
  readdir,
} from "fs";
import path from "path";
import { cwd } from "process";
import { ManifestPlugin } from "./plugins.mjs";

const isDev = process.env.NODE_ENV === "development";
const env = "development";
// const env = "production";

function getAliases() {
  const folders = readdir(
    path.resolve(import.meta.dirname, "src"),
    { withFileTypes: true },
    (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        return;
      }

      console.log(files);
    }
  );

  return {
    "@/*": path.resolve(import.meta.dirname, "src"),
    public: path.resolve(import.meta.dirname, "public"),
    "@/helpers": path.resolve(import.meta.dirname, "src/helpers"),
    "@/components": path.resolve(import.meta.dirname, "src/components"),
  };
}

/** @type {import('@rspack/cli').Configuration} */
export default {
  cache: true,
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: getAliases(),
    // alias: {
    //   "@/*": path.resolve(import.meta.dirname, "src"),
    //   public: path.resolve(import.meta.dirname, "public"),
    //   "@/helpers": path.resolve(import.meta.dirname, "src/helpers"),
    //   "@/components": path.resolve(import.meta.dirname, "src/components"),
    // },
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
    path: `${
      env === "development"
        ? `${path.resolve(import.meta.dirname, "dev")}`
        : `${path.resolve(import.meta.dirname, "dist")}`
    }`,
    publicPath: "/",
    filename: `${env === "development" ? "[name].js" : "[name].js"}`,
    chunkFilename: `${
      env === "development"
        ? "./chunks/[name].js"
        : "./chunks/[name].[contenthash].js"
    }`,
    assetModuleFilename: "[name].[contenthash][ext]",
    clean: true,
    sourceMapFilename: "[file].map",
  },
  devServer: {
    historyApiFallback: false,
    hot: env === "development",
    port: 3000,
    devMiddleware: {
      writeToDisk: true,
    },
    static: {
      directory: `${path.resolve(import.meta.dirname, "dev")}`,
    },
  },
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: "all",
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      cacheGroups: {
        pagesDir: {
          test: /[\\/]src[\\/]pages[\\/].*\.tsx?$/,
          name(module, chunks, cacheGroupKey) {
            const match = module.resource.match(
              /src[\\/]pages[\\/]([^\\/]+)\/page\.tsx?$/
            );
            return match ? match[1] : "page";
          },
          chunks: "async",
          filename: "pages/[name].[contenthash].js",
        },
      },
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
    new rspack.HtmlRspackPlugin({
      template: "./index.html",
      minify: env === "production",
    }),
    env === "development" && new ReactRefreshPlugin(),
    // env === "development" && new rspack.HotModuleReplacementPlugin(),
    new ManifestPlugin(),
  ],
};
