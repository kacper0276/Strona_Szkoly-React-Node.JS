import { useEffect, useRef, useState } from "react";
import styles from "./Slider.module.css";
import FullscreenSlider from "../FullscreenSlider/FullscreenSlider";

export default function Slider(props) {
  const [image, setImage] = useState([]);
  const [autoPlayStatus, setAutoPlayStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openFullscreen, setOpenFullscreen] = useState(false);
  const [classActual, setClassActual] = useState("");
  const [iterator, setIterator] = useState(1);
  const slider = useRef();
  const downloadButton = useRef();

  useEffect(() => {
    setImage(props.img);
    // setIterator(props.img.length + );
    setLoading(false);
  }, []);

  useEffect(() => {
    if (autoPlayStatus) {
      const interval = setInterval(() => {
        nextPhoto();
      }, 2000);
      return () => clearInterval(interval);
    }
  });

  const nextPhoto = () => {
    iterator < image.length - 1 ? setIterator(iterator + 1) : setIterator(0);

    slider.current.src = `/photos/${image[iterator]}`;
    downloadButton.current.href = `/photos/${image[iterator]}`;
  };

  const previousPhoto = () => {
    iterator <= 0 ? setIterator(image.length - 1) : setIterator(iterator - 1);

    slider.current.src = `/photos/${image[iterator]}`;
    downloadButton.current.href = `/photos/${image[iterator]}`;
  };

  return !loading ? (
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
        <img
          alt="img"
          src={`/photos/${image[iterator - 1]}`}
          className={`${classActual}`}
          ref={slider}
          onLoad={(e) => {
            e.target.naturalHeight > e.target.naturalWidth
              ? setClassActual(`${styles.img_vertical}`)
              : setClassActual(`${styles.img_horizontal}`);
          }}
        />
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
        <div className={`${styles.buttons_div}`}>
          <button className={`${styles.download_button}`}>
            <a download href={`/photos/${image[0]}`} ref={downloadButton}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className={`bi bi-download ${styles.download}`}
                viewBox="0 0 16 16"
              >
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
              </svg>
            </a>
          </button>
          <button
            className={`${styles.play_button}`}
            onClick={() => {
              setAutoPlayStatus(!autoPlayStatus);
            }}
          >
            {!autoPlayStatus ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="white"
                className={`bi bi-play ${styles.other_buttons}`}
                viewBox="0 0 16 16"
              >
                <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="white"
                className={`bi bi-square-fill ${styles.other_buttons}`}
                viewBox="0 0 16 16"
              >
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setOpenFullscreen(true)}
            className={`${styles.play_button}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="white"
              className={`bi bi-fullscreen ${styles.other_buttons}`}
              viewBox="0 0 16 16"
            >
              <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z" />
            </svg>
          </button>
        </div>
      </div>
      {openFullscreen ? (
        <FullscreenSlider
          slides={image}
          handleClose={() => setOpenFullscreen(false)}
          setIterator={setIterator}
          iterator={iterator}
        />
      ) : null}
    </>
  ) : (
    <div>Ładowanie</div>
  );
}
