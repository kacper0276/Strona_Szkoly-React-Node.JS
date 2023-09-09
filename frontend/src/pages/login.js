import setTitle from "../functions/set-title";
import { Link } from "react-router-dom";
import { url } from "../App";
import axios from "axios";
import { useContext, useState } from "react";
import LoginContext from "../context/LoginContext";

const Login = () => {
  setTitle("Logowanie");

  const [errorBox, setErrorBox] = useState();
  const context = useContext(LoginContext);

  const log = (event) => {
    event.preventDefault();
    const login = document.querySelector("#login").value;
    const password = document.querySelector("#pass").value;

    axios
      .post(`${url}/logowanie`, { login: login, password: password })
      .then((response) => {
        console.log(response);
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
          window.location.reload();
        }
      });
    // localStorage.setItem("isLogged", "true");
    // window.location.reload();
  };

  return (
    <>
      <div className="cms-login-cnt">
        <div className="login-pics"></div>
        <div className="login-main-cnt">
          <Link to={"/"}>
            <img src="/images/CKZIU.svg" alt="logo CKZiU" />
          </Link>
          <h3>Zaloguj się</h3>
          <form className="login-form" onSubmit={(event) => log(event)}>
            <label className="login-input">
              <input type={"text"} name={"username"} id={"login"} required />
              <span>Login</span>
            </label>
            <label className="login-input">
              <input
                type={"password"}
                name={"current-password"}
                id={"pass"}
                required
              />
              <span>Hasło</span>
            </label>
            <button className="login-btn" name="submit">
              Zaloguj
            </button>
          </form>
          {errorBox}
        </div>
      </div>
    </>
  );
};

export default Login;
