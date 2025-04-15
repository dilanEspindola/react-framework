import React from "react";

interface Props {
  children: React.ReactNode;
  to: string;
}

export const Link = ({ children, to }: Props) => {
  const navigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.history.pushState({}, "", to);
    const navigationEvent = new PopStateEvent("navigate");

    window.dispatchEvent(navigationEvent);
  };

  return (
    <a href={to} onClick={navigate}>
      {children}
    </a>
  );
};
