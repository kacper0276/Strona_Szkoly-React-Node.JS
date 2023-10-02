import { Link } from "react-router-dom";
import monthTransform from "../functions/month";
import parse from "html-react-parser";

const FirstPageNews = (props) => {
  return (
    <div className="first_page_news_cnt">
      <div className="first_page_news">
        <div className="news-title-cnt">
          <div>
            <h2 className="news-title">{props.title}</h2>
          </div>
          <div className="news-date-cnt">
            <span className="date-elm">{new Date(props.date).getDate()}</span>
            <span className="date-elm">
              {monthTransform(new Date(props.date).getMonth())}
            </span>
            <span className="date-elm">
              {new Date(props.date).getFullYear()}
            </span>
          </div>
        </div>
        <div className="first-page-news-content">
          <div className="first-page-news-img">
            {props.img == "noimg.svg" ? (
              <img src={`/images/${props.img}`} className="no-img-news" />
            ) : (
              <img src={`/news/${props.img}`} alt={`${props.alt}`} />
            )}
          </div>
          <div className="first-page-news-text">
            {parse(props.long)}
            {/* {parse(props.short)} */}
          </div>
        </div>
        <div className="more-news-cnt">
          <Link to="/aktualnosci/wszystkie/1">
            Więcej aktualności &#62;&#62;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FirstPageNews;
