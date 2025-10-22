import React from "react";
import "./Styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} London Mason</p>
    </footer>
  );
}
