import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { url } from "../App";
import markActive from "../functions/markactive";
import setTitle from "../functions/set-title";
//News
import News from "../components/news";
const NewsPage = () => {
  markActive("none");

  let { name, page } = useParams();
  const nav = useNavigate();
  const location = useLocation();

  const [pageCount, setPageCount] = useState();
  const [newsTab, setNewsTab] = useState([]);
  const [available, setAvailable] = useState([]);
  const [title, setTitleName] = useState();
  const [pagiStatus, setPagiStatus] = useState();

  const handleClick = (data) => {
    nav(`/aktualnosci/${name}/${data.selected + 1}`);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    fetch(`${url}/aktualnosci/${name}?page=${page}`)
      .then((response) => response.json())
      .then((response) => {
        let temp = [];
        if (response.data != "Brak aktualności") {
          setPageCount(response.numberOfPages);
          response.data.forEach((news) => {
            temp.push(
              <News
                title={news.title}
                date={news.date}
                img={news.img}
                desc={news.shortdes}
                long={news.longdes}
                key={news.id}
                link={news.id}
                linkName={name}
              />
            );
          });
          setNewsTab(temp);
          setPagiStatus("");
          temp = [];
        } else {
          temp.push(<h3>Brak aktualności do wyświetlenia</h3>);
          setNewsTab(temp);
          setPagiStatus("disabled");
          temp = [];
        }
        setTitle(`Aktualności: ${response.title}`);
        let arr = [];
        response.obj.forEach((option) => {
          if (!response.title.includes(option.path.trim())) {
            arr.push(<option value={option.path}>{option.name}</option>);
          } else {
            arr.push(
              <option value={option.path} selected>
                {option.name}
              </option>
            );
            setTitleName(option.name);
          }
        });
        // setTitleName(response.title);
        setAvailable(arr);
      });
  }, [page, name]);

  useEffect(() => {
    fetch(`${url}/aktualnosci/${name}?page=${page}`)
      .then((response) => response.json())
      .then((response) => {
        let temp = [];
        if (response.data != "Brak aktualności") {
          setPageCount(response.numberOfPages);
          response.data.forEach((news) => {
            temp.push(
              <News
                alt={news.alt}
                title={news.title}
                date={news.date}
                img={news.img}
                desc={news.shortdes}
                long={news.longdes}
                key={news.id}
                link={news.id}
                linkName={name}
              />
            );
          });
          setNewsTab(temp);
          setPagiStatus("");
          temp = [];
        } else {
          temp.push(<h3>Brak aktualności do wyświetlenia</h3>);
          setNewsTab(temp);
          setPagiStatus("disabled");
          temp = [];
        }
        setTitle(`Aktualności: ${response.title}`);
        let arr = [];
        response.obj.forEach((option) => {
          if (!response.title.includes(option.path.trim()))
            arr.push(<option value={option.path}>{option.name}</option>);
          else {
            arr.push(
              <option value={option.path} selected>
                {option.name}
              </option>
            );
            setTitleName(option.name);
          }
        });
        // setTitleName(response.title);
        setAvailable(arr);
      });
  }, [location]);

  const changeNews = () => {
    const chosenOne = document.querySelector("#options").value;
    nav(`/aktualnosci/${chosenOne}/1`);
  };

  return (
    <>
      <div className="news-container">
        <div className="news-select">
          <h1>{title}</h1>
          <div className="news-select-cnt">
            <select onChange={changeNews} id={"options"}>
              {available.map((item) => {
                return item;
              })}
            </select>
            {/* <input type='date'></input> */}
          </div>
        </div>
        <div className="news-cnt">
          {newsTab.map((item) => {
            return item;
          })}
          <ReactPaginate
            previousLabel={"<<"}
            nextLabel={">>"}
            breakLabel={"..."}
            pageCount={pageCount}
            pageRangeDisplayed={1}
            marginPagesDisplayed={3}
            containerClassName={`pagination ${pagiStatus}`}
            pageClassName={"page"}
            previousClassName={"previous"}
            nextClassName={"next"}
            breakClassName={"page-break"}
            onPageChange={handleClick}
            initialPage={page - 1}
          />
        </div>
      </div>
    </>
  );
};

export default NewsPage;
