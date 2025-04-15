import { useEffect, useState, type JSX } from "react";

interface Props {
  path: string;
  Component: any;
}

const Route = (props: Props) => {
  const { Component, path } = props;

  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("navigate", onLocationChange);

    return () => {
      window.removeEventListener("navigate", onLocationChange);
    };
  }, []);

  return currentPath === path ? <Component /> : null;
};

export default Route;
