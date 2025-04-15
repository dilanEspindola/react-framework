import { useEffect, useState } from "react";
import styles from "../../styles/home.module.css";

const HomePage = () => {
  const [counter, setCounter] = useState(0);

  const increment = () => {
    setCounter(counter + 1);
  };

  return (
    <div className={styles.homeContainer}>
      <div>
        <h1>Home Page</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint amet
          quibusdam est possimus, mollitia dolores iure alias vero quas, optio
          et libero, maiores omnis unde veniam asperiores labore aliquam
          dignissimos!
        </p>
      </div>

      <div>
        <h1>Counter</h1>
        <p>Counter: {counter}</p>
        <button onClick={increment}>increment</button>
      </div>
    </div>
  );
};

export default HomePage;
