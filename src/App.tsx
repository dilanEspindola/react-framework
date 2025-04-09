import { useState } from "react";
import image from "../public/image2.jpg";
import { getRandomToken } from "./helpers/get-token.ts";
import styles from "./styles/app.module.css";

export function App() {
  const [counter, setCounter] = useState(0);

  return (
    <div className={styles.container}>
      <h1 className={`${styles.h1Styles}`}>hello</h1>

      <div className={styles.counter}>
        <p>Counter: {counter}</p>
        <button onClick={() => setCounter(counter + 1)}>Increment</button>
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
