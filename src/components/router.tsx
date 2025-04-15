import { useEffect, useState, type JSX } from "react";

interface Props {
  path: string;
  Component: () => JSX.Element;
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

  const pathTransformed = path === "/" ? "/" : path.replace("", "/");

  return currentPath === pathTransformed ? <Component /> : null;
};

export default Route;
