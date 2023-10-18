import React, { useEffect } from "react";
import "./Snackbar.css";

const Snackbar = ({ message, type, onClose }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [onClose]);

  const snackbarType = type === "error" ? "error" : "success";

  return <div className={`snackbar ${snackbarType}`}>{message}</div>;
};

export default Snackbar;
