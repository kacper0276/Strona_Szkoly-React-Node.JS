import { Link, useNavigate } from "react-router-dom";
import styles from "./Footer.module.css";
import { useContext } from "react";
import LoginContext from "../../context/LoginContext";

export default function FooterGallery() {
  const context = useContext(LoginContext);
  const navigate = useNavigate();

  return (
    <div className={`${styles.footer}`}>
      <p>
        &copy; Strona wykonana przez: <strong>Kacper Renkel</strong> |{" "}
      </p>
      <p>
        <Link to="/" className={`${styles.href}`}>
          Strona szkoły
        </Link>{" "}
        |{" "}
      </p>
      {sessionStorage.getItem("isLogged") ? (
        sessionStorage.getItem("isLogged") == "true" &&
        context.state.userLoggin ? (
          context.state.userStatus.includes("galeria") ||
          context.state.userStatus.includes("admin") ? (
            <>
              <p>
                <Link to={"/galeria/paneladmina"} className={`${styles.href}`}>
                  Panel admina
                </Link>{" "}
                |{" "}
              </p>
              <p
                className={`${styles.logout}`}
                onClick={(e) => {
                  localStorage.clear();
                }}
              >
                Wyloguj się
              </p>
            </>
          ) : (
            <p
              className={`${styles.logout}`}
              onClick={(e) => {
                sessionStorage.setItem("isLogged", "false");
                localStorage.removeItem("token");
                // setTimeout(() => {
                // window.location.reload();
                navigate("/galeria");
                // }, 1000);
              }}
            >
              Wyloguj się
            </p>
          )
        ) : (
          <p>
            <Link to={"/galeria/zaloguj"} className={`${styles.href}`}>
              Zaloguj się
            </Link>
          </p>
        )
      ) : (
        <p>
          <Link to={"/galeria/zaloguj"} className={`${styles.href}`}>
            Zaloguj się
          </Link>
        </p>
      )}
    </div>
  );
}
