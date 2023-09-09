//SwiperJS
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
//Hooks
import { useEffect, useState } from "react";
//URL
import { url } from "../App";
import { Link } from "react-router-dom";
import setTitle from "../functions/set-title";
import markActive from "../functions/markactive";
import FirstPageNews from "../components/firstpagenews";
//Pages
import NewsPage from "./newspage";
SwiperCore.use([Autoplay, Pagination, Navigation]);

const Mainpage = () => {
  const [mainNews, setMainNews] = useState([]);

  useEffect(() => {
    markActive("glowna");
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        let temp = [];
        response.data.mainArticle.forEach((element) => {
          temp.push(
            <FirstPageNews
              img={element.img}
              long={element.longdes}
              short={element.shortdes}
              date={element.date}
              title={element.title}
            />
          );
        });
        setMainNews(temp);
      });
    setTitle("Strona Główna");
  }, []);

  return (
    <>
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        centeredSlides={false}
        autoplay={{
          delay: 7000,
          disableOnInteraction: true,
        }}
        loop={true}
        navigation={true}
        className="mySwiper"
      >
        {mainNews.map((item) => {
          return <SwiperSlide>{item}</SwiperSlide>;
        })}
        <SwiperSlide>
          <div className="slide-content first-slide">
            <div className="slide-logo">
              <img src="./images/CKZIUWhiteOutline.svg" alt="logo" />
              <h1>
                Centrum Kształcenia
                <br /> Ustawicznego I Zawodowego <br />W Brodnicy
              </h1>
            </div>
            <img src="./images/holder.png" alt="" />
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default Mainpage;
