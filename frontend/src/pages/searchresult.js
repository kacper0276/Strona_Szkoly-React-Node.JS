import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { url } from "../App";
import axios from "axios";
import News from "../components/news";
import setTitle from "../functions/set-title";
import markActive from "../functions/markactive";

const SearchResult = () => {
  const { keywords } = useParams();

  const [news, setNews] = useState([]);

  markActive("none");

  useEffect(() => {
    axios
      .post(`${url}/szukaj`, { keywords: keywords })
      //.then(response => response.json())
      .then((response) => {
        setTitle("Szukaj");
        if (response.data.searchData != "Nie znaleziono szukanej frazy") {
          let temp = [];
          response.data.searchData.forEach((item) => {
            temp.push(
              <News
                alt={item.alt}
                title={item.title}
                date={item.date}
                img={item.img}
                desc={item.shortdes}
                key={item.id}
                link={item.id}
                linkName={"cos"}
              />
            );
          });
          setNews(temp);
        } else {
          setNews([`${response.data.searchData}`]);
        }
      });
  }, [keywords]);

  return (
    <div className="news-container">
      <div className="news-cnt">
        {news.map((item) => {
          return item;
        })}
      </div>
    </div>
  );
};

export default SearchResult;
