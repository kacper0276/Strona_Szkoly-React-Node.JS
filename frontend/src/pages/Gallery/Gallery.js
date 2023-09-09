import styles from "./Gallery.module.css";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";
import MiniIconAlbum from "./MiniIconAlbum/MiniIconAlbum";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import LoadingIcon from "../../Layout/UI/LoadingIcon/LoadingIcon";
import { url } from "../../App";

export default function Gallery() {
  useWebsiteTitle("CKZiU | Galeria szkoły");
  const location = useLocation();
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    axios.get(`${url}/rokszkolny`).then((res) => {
      setYears(res.data.years);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, [location]);

  return (
    <div className={`${styles.gallery_component}`}>
      <strong style={{ fontSize: "20px" }}>
        Galeria szkolna CKZiU w Brodnicy
      </strong>
      <p>Wybierz rok szkolny</p>
      <div className={`${styles.year_school_select}`}>
        {loading ? (
          <LoadingIcon />
        ) : (
          <>
            {years.map((year, key) => {
              return (
                <MiniIconAlbum
                  name={`${year.rok_szkolny}`}
                  img={`${year.photo}`}
                  path={`schoolYear`}
                  type="rok"
                  key={key}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
