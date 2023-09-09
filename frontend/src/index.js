import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter as Router, Routes, Link } from "react-router-dom";
//CSS
import "swiper/swiper-bundle.css";
import "./css/index.css";
import "./css/contrast.css";
import App from "./App";

ReactDOM.render(
  // <React.StrictMode>
  // </React.StrictMode>
  <App />,
  document.getElementById("root")
);
