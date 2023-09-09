import { useContext } from "react";
import { Navigate } from "react-router-dom";
import LoginContext from "../context/LoginContext";

export default function AuthtenticatedRoute({ children }) {
  const auth = window.localStorage.getItem("login-status");
  const context = useContext(LoginContext);

  if (sessionStorage.getItem("isLogged")) {
    if (
      sessionStorage.getItem("isLogged") == "true" &&
      context.state.userLoggin
    ) {
      return children;
    } else {
      return <Navigate to="/galeria" />;
    }
  } else {
    sessionStorage.setItem("isLogged", "false");
    return <Navigate to="/galeria" />;
  }
}
