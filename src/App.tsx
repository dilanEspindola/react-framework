import { useState } from "react";
import image from "../public/image2.jpg";
import { getRandomToken } from "./helpers/get-token.ts";
import styles from "./styles/app.module.css";
import { Link } from "./components/link.tsx";

export function App() {
  const [counter, setCounter] = useState(0);

  return (
    <div className={styles.container}>
      <h1 className={`${styles.h1Styles}`}>hola :Ds</h1>

      <div className={styles.counter}>
        <p>Counters: {counter}</p>
        <button onClick={() => setCounter(counter + 1)}>incrementar</button>
      </div>
      <img
        src={image}
        alt="nikke"
        width={400}
        height={200}
        style={{ objectFit: "contain" }}
        loading="lazy"
      />

      <p>Random Token: {getRandomToken()}</p>
    </div>
  );
}
