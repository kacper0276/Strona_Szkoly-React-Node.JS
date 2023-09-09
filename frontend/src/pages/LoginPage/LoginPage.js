import { useContext, useState } from "react";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";
import styles from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginContext from "../../context/LoginContext";
import { url } from "../../App";

export default function LoginPage() {
  useWebsiteTitle("CKZiU | Logowanie");
  const navigate = useNavigate();
  const [errorBox, setErrorBox] = useState();
  const context = useContext(LoginContext);

  const loginFunction = (event) => {
    event.preventDefault();
    const login = document.querySelector("#login").value;
    const password = document.querySelector("#pass").value;

    axios
      .post(`${url}/logowanie`, { login: login, password: password })
      .then((response) => {
        if (response.data.auth === false) {
          sessionStorage.setItem("isLogged", "flase");
          setErrorBox(<p className="login-error">{response.data.errors}</p>);
        } else if (response.data.auth === true) {
          window.localStorage.setItem("token", response.data.token);
          sessionStorage.setItem("isLogged", "true");
          window.localStorage.setItem(
            "username",
            response.data.userData[0].klasa
          );
          context.dispatch({
            type: "change-login-status",
            userType: response.data.userData[0].klasa,
          });
          setTimeout(() => {
            navigate("/galeria/paneladmina");
          }, 2000);
        }
      });
    // localStorage.setItem("isLogged", "true");
    // window.location.reload();
  };

  return (
    <div className={`${styles.main_container}`}>
      <div className={`${styles.div_form}`}>
        <form className={`${styles.form}`}>
          <div>
            <label htmlFor="login">Login: </label>
            <input type="text" id="login" autoComplete="off" />
          </div>
          <div>
            <label htmlFor="haslo">Hasło: </label>
            <input type="password" id="pass" />
          </div>
          <button className={`${styles.login_button}`} onClick={loginFunction}>
            Zaloguj się
          </button>
          {errorBox}
        </form>
      </div>
    </div>
  );
}
