import { useState } from "react";
import styles from "./DeleteInAdminPanel.module.css";
import DeleteSchoolYear from "./DeleteSchoolYear/DeleteSchoolYear";
import DeleteAlbum from "./DeleteAlbum/DeleteAlbum";
import DeletePhotos from "./DeletePhotos/DeletePhotos";

export default function DeleteInAdminPanel() {
  const [whichShow, setWhichShow] = useState(0);

  function renderSwitch(param) {
    switch (whichShow) {
      case 1:
        return <DeleteSchoolYear />;
      case 2:
        return <DeleteAlbum />;
      case 3:
        return <DeletePhotos />;
      default:
        return null;
    }
  }

  return (
    <div className={`${styles.main_container}`}>
      <div className={`${styles.button_div}`}>
        <button
          className={`${styles.btn}`}
          onClick={(e) => {
            e.preventDefault();
            setWhichShow(1);
          }}
        >
          Rok szkolny
        </button>
        <button
          className={`${styles.btn}`}
          onClick={(e) => {
            e.preventDefault();
            setWhichShow(2);
          }}
        >
          Albumy w roku szkolnym
        </button>
        <button
          className={`${styles.btn}`}
          onClick={(e) => {
            e.preventDefault();
            setWhichShow(3);
          }}
        >
          Zdjęcia w albumie
        </button>
      </div>
      <div className={`${styles.content_container}`}>
        {renderSwitch(whichShow)}
      </div>
    </div>
  );
}
