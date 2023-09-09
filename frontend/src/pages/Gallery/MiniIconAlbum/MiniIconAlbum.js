import { Link } from "react-router-dom";
import styles from "./MiniIconAlbum.module.css";

export default function MiniIconAlbum(props) {
  return (
    <div className={`${styles.main_container}`}>
      {props.years ? (
        <Link
          to={`/galeria/przegladaj${props.type}/${props.years}/${props.name}`}
          style={{
            color: "white",
          }}
        >
          <img
            alt="img"
            src={`/${props.path}/${props.img}`}
            style={{
              width: "225px",
              height: "225px",
            }}
          />
          <span className={`${styles.name_album}`}>{props.name}</span>
        </Link>
      ) : (
        <Link
          to={`/galeria/przegladaj${props.type}/${props.name}`}
          style={{
            color: "white",
          }}
        >
          <img
            alt="img"
            src={`/${props.path}/${props.img}`}
            style={{
              width: "225px",
              height: "225px",
            }}
          />
          <span className={`${styles.name_album}`}>{props.name}</span>
        </Link>
      )}
    </div>
  );
}
