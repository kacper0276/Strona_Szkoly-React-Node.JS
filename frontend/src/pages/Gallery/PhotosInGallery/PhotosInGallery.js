import { useParams } from "react-router-dom";
import useWebsiteTitle from "../../../hooks/useWebsiteTitle";
import styles from "./PhotosInGallery.module.css";
import Slider from "../../../Layout/UI/Slider/Slider";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingIcon from "../../../Layout/UI/LoadingIcon/LoadingIcon";
import { url } from "../../../App";

export default function PhotosInGallery() {
  const { name, year } = useParams();
  useWebsiteTitle(`CKZiU | Album: ${name}`);

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = async () => {
    axios.get(`${url}/zdjeciazalbumu/${year}/${name}`).then((res) => {
      if (res.data.photos.length) {
        setPhotos(JSON.parse(res.data.photos[0].name_photo));
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <div className={`${styles.main_container}`}>
      <strong
        style={{
          color: "white",
        }}
      >
        Zdjęcia z albumu: "{name}"
      </strong>
      {loading ? (
        <LoadingIcon />
      ) : photos.length != 0 ? (
        <div className={`${styles.slider}`}>
          <Slider img={photos} />
        </div>
      ) : (
        <p
          style={{
            color: "white",
            marginTop: "50px",
          }}
        >
          Brak zdjęć w albumie
        </p>
      )}
    </div>
  );
}
