import parse from "html-react-parser";
import { Link } from "react-router-dom";
import monthTransform from "../functions/month";

const News = (props) => {
  return (
    <div className="news-item">
      <div className="news-title-cnt">
        <h3>{props.title}</h3>
        <div className="news-date-cnt">
          <span className="date-elm">{new Date(props.date).getDate()}</span>
          <span className="date-elm">
            {monthTransform(new Date(props.date).getMonth())}
          </span>
          <span className="date-elm">{new Date(props.date).getFullYear()}</span>
        </div>
      </div>
      <div className="news-item-content">
        <div className="news-image">
          {props.img == "noimg.svg" ? (
            <img src={`/images/${props.img}`} className="no-img-news" />
          ) : (
            <img src={`/news/${props.img}`} />
          )}
        </div>
        <div className="news-item-text">
          {parse(props.desc)}
          {/* {parse(props.longDesc)} */}
        </div>
      </div>
      {/* <h1>{props.title}</h1>
            <h1>{parse(props.desc)}</h1>
            <h1>{props.date}</h1>
            <h1>{props.title}</h1> */}

      {props.long == "" ? null : (
        <div className="more-news-cnt">
          <Link
            to={`/aktualnosci/czytajwiecej/${props.linkName}/${props.link}`}
          >
            Czytaj dalej &#62;&#62;
          </Link>
        </div>
      )}
    </div>
  );
};

export default News;
