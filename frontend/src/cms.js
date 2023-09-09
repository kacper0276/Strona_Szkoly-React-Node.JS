import AdminPanel from "./pages/adminpanel";
import Login from "./pages/login";
import "./css/cms.css";
import { useContext } from "react";
import LoginContext from "./context/LoginContext";

const CMS = () => {
  const context = useContext(LoginContext);

  if (localStorage.getItem("contrast")) {
    const doc = document.querySelector("html");
    doc.classList.remove("contrast");
    localStorage.setItem("contrast", 0);
  }

  if (sessionStorage.getItem("isLogged")) {
    if (
      sessionStorage.getItem("isLogged") == "true" &&
      context.state.userLoggin
    ) {
      return <AdminPanel />;
    } else {
      return <Login />;
    }
  } else {
    sessionStorage.setItem("isLogged", "false");
    return <Login />;
  }
};

export default CMS;
