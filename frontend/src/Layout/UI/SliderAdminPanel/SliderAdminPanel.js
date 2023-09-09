import styles from "./SliderAdminPanel.module.css";
import { useEffect, useRef, useState } from "react";

export default function SliderAdminPanel(props) {
  const [image, setImage] = useState([]);
  const slider = useRef();
  const [iterator, setIterator] = useState(0);

  useEffect(() => {
    setImage(props.img);
  }, []);

  useEffect(() => {
    props.setActualPhoto(props.img[iterator]);
    slider.current.src = `/photos/${image[iterator]}`;
  }, [iterator]);

  const nextPhoto = () => {
    iterator < image.length - 1 ? setIterator(iterator + 1) : setIterator(0);
  };

  const previousPhoto = () => {
    iterator <= 0 ? setIterator(image.length - 1) : setIterator(iterator - 1);
  };

  return (
    <>
      <div className={`${styles.slider_div}`}>
        <div className={`${styles.left_array}`}>
          <button onClick={previousPhoto}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              fill="white"
              className={`bi bi-arrow-left ${styles.arrow_style}`}
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
              />
            </svg>
          </button>
        </div>
        <img alt="img" src={`/photos/${image[0]}`} ref={slider} />
        <div className={`${styles.right_array}`}>
          <button onClick={nextPhoto}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              fill="white"
              className={`bi bi-arrow-right ${styles.arrow_style}`}
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
