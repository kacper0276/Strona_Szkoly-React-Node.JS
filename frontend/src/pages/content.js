import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import { url } from "../App";
import setTitle from "../functions/set-title";
import markActive from "../functions/markactive";
import { Link } from "react-router-dom";

const Content = () => {
  const location = useLocation();
  const nav = useNavigate();
  const [content, setContent] = useState();
  const [fold, setFold] = useState(true);
  const [menu, setMenu] = useState([]);
  const [vis, setVis] = useState("disabled");
  const [menuTitle, setMenuTitle] = useState();

  useEffect(() => {
    markActive("none");
    fetch(`${url + window.location.pathname}`)
      .then((response) => response.json())
      .then((response) => {
        setTitle(response.title);
        setContent(parse(response.content));
        if (response.menu) {
          setMenuTitle(response.title);
          let temp = [];
          response.menu.forEach((item) => {
            temp.push([
              <Link to={item.path}>{item.nazwa}</Link>,
              item.path,
              item.nazwa,
            ]);
          });
          setMenu(temp);
          setVis("");
        } else {
          setVis("disabled");
        }
      });
  }, [location]);

  const swapMenu = () => {
    setFold((prev) => !prev);
    if (fold) {
      document.querySelector(".dropdown-menu-cnt").classList.remove("fold");
    } else {
      document.querySelector(".dropdown-menu-cnt").classList.add("fold");
    }
  };

  const handleInput = (loc) => {
    nav(loc);
  };
  return (
    <div className="main-content-cnt">
      <div className={"dropdown-menu-cnt fold " + vis}>
        <div className="dropdown-menu">
          {menu.map((item) => {
            return item[0];
          })}
        </div>
        <div className="title">{menuTitle}</div>
        <button className="dropdown-btn" onClick={swapMenu}></button>
      </div>
      <div className={"dropdown-menu-select " + vis}>
        <select onInput={(e) => handleInput(e.target.value)}>
          {menu.map((item) => {
            return location.pathname == item[1] ? (
              <option value={item[1]} selected>
                {item[2]}
              </option>
            ) : (
              <option value={item[1]}>{item[2]}</option>
            );
          })}
        </select>
      </div>
      <div className="content-cnt">{content}</div>
    </div>
  );
};

export default Content;
