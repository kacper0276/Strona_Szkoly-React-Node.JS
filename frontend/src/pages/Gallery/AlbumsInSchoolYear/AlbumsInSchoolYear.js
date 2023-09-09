import { useLocation, useParams } from "react-router-dom";
import styles from "./AlbumsInSchoolYear.module.css";
import useWebsiteTitle from "../../../hooks/useWebsiteTitle";
import MiniIconAlbum from "../MiniIconAlbum/MiniIconAlbum";
import LoadingIcon from "../../../Layout/UI/LoadingIcon/LoadingIcon";
import axios from "axios";
import { useEffect, useState } from "react";
import { url } from "../../../App";

export default function AlbumsInSchoolYear() {
  const { year } = useParams();
  const location = useLocation();
  useWebsiteTitle(`CKZiU | Albumy w roku szkolnym ${year}`);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlbums = async () => {
    axios.get(`${url}/albumy/${year}`).then((res) => {
      setAlbums(res.data.albums);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAlbums();
  }, [location]);

  return (
    <div className={`${styles.main_container}`}>
      <p>
        Albumy w roku szkolnym: <strong>{year}</strong>
      </p>
      <div className={`${styles.album_select}`}>
        {loading ? (
          <LoadingIcon />
        ) : albums.length == 0 ? (
          <p style={{ color: "white" }}>Brak albumów w roku szkolnym: {year}</p>
        ) : (
          albums.map((album, key) => {
            return (
              <MiniIconAlbum
                name={`${album.name}`}
                img={`${album.mini}`}
                years={`${album.years}`}
                path={"album"}
                type="album"
                key={key}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
