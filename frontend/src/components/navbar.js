import react from "react";
import reactDom from "react-dom";
//hooks
import { useEffect, useState } from "react";
//components
import ContactItem from "./contactItem";
import Dropdown from "./dropdown";
//Router
import { Link, useNavigate, useLocation } from "react-router-dom";
//URL
import { url } from "../App";
import calcHeight from "../functions/calcheight";
import unfoldMenu from "../functions/unfoldmenu";

const Navbar = () => {
  // let isOpen = false;

  //stores contrast status
  const [isContrast, setIsContrast] = useState(true);
  //contrast switch function
  const switchContrast = () => {
    setIsContrast((prev) => {
      return !prev;
    });
    const doc = document.querySelector("html");
    if (isContrast) {
      doc.classList.add("contrast");
      localStorage.setItem("contrast", 1);
    } else {
      doc.classList.remove("contrast");
      localStorage.setItem("contrast", 0);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("contrast") == 1) {
      switchContrast();
    }
    sessionStorage.setItem("isOpen", "false");
  }, []);

  let pageFontSize;

  const applyFontSize = () => {
    const page = document.querySelector("html");
    page.style.fontSize = pageFontSize + "px";
  };

  //reads font size from localstorage or sets one if its unset
  if (localStorage.getItem("fontSize")) {
    parseInt((pageFontSize = localStorage.getItem("fontSize")));
    applyFontSize();
  } else {
    localStorage.setItem("fontSize", 16);
    parseInt((pageFontSize = localStorage.getItem("fontSize")));
    applyFontSize();
  }

  //changes font size
  const changeFont = (btn) => {
    if (btn == "rem" && pageFontSize > 16) {
      pageFontSize--;
      localStorage.setItem("fontSize", pageFontSize);
      applyFontSize();
      setTimeout(calcHeight, 0);

      calcHeight();
    } else if (btn == "add" && pageFontSize < 21) {
      pageFontSize++;
      localStorage.setItem("fontSize", pageFontSize);
      applyFontSize();
      setTimeout(calcHeight, 0);

      calcHeight();
    }
  };

  //stores mobile menu status
  // const [isOpen,setIsOpen] = useState();
  // // console.log(isOpen);
  // useEffect(()=>{
  //     setIsOpen(true);
  // },[]);
  //mobile menu switch function
  // const unfoldMenu = () =>{
  //     // console.log('UNFOLD0');
  //     // isOpen = !isOpen;
  //     // setTimeout(200);
  //     if(window.innerWidth <= 1100){
  //         setIsOpen((prev)=>{
  //             return !prev;
  //         })

  //         const menu = document.querySelector('.mobile_menu');
  //         const btn = document.querySelector('.mobile-toggle-btn');
  //         const doc = document.querySelector('html');
  //         const docBody = document.querySelector('body');
  //         const root = document.querySelector('#root');

  //         // console.log(isOpen);
  //         if(isOpen){
  //             menu.classList.remove('disabled-menu');
  //             btn.classList.add('active-btn');
  //             doc.style.overflow = 'hidden';
  //             docBody.style.overflow = 'hidden';
  //             // console.log('UNFOLD1');
  //         }else{
  //             menu.classList.add('disabled-menu');
  //             btn.classList.remove('active-btn');
  //             doc.style.overflowY = 'auto';
  //             docBody.style.overflowY = 'auto';
  //             // console.log('UNFOLD2');
  //         }
  //     }
  // }

  //stores contact components
  const [contactItems, setContactItems] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [menu, setMenu] = useState([]);
  const location = useLocation();
  //fetch contact info
  useEffect(() => {
    if (document.location.pathname.includes("szkoly")) {
      const buildingName = document.location.pathname.split("/");
      fetch(`${url}/contact/${buildingName[2]}`)
        .then((response) => response.json())
        .then((response) => {
          let temp = [];
          temp.push(
            <ContactItem
              content={response.contact[0].email}
              src="/images/Mail.svg"
              link={`mailto:${response.contact[0].email}`}
              key="1"
            />
          );
          temp.push(
            <ContactItem
              content={response.contact[0].phone_number}
              src="/images/phone-call.png"
              link={`tel:${response.contact[0].phone_number}`}
              key="2"
            />
          );
          temp.push(
            <ContactItem
              src="/images/pin.png"
              link={response.contact[0].link}
              content={response.contact[0].adres}
              key="3"
            />
          );
          setContactItems(temp);
        });
    } else {
      fetch(`${url}/contact/glowna`)
        .then((response) => response.json())
        .then((response) => {
          let temp = [];
          temp.push(
            <ContactItem
              content={response.contact[0].email}
              src="/images/Mail.svg"
              link={`mailto:${response.contact[0].email}`}
              key="1"
            />
          );
          temp.push(
            <ContactItem
              content={response.contact[0].phone_number}
              src="/images/phone-call.png"
              link={`tel:${response.contact[0].phone_number}`}
              key="2"
            />
          );
          temp.push(
            <ContactItem
              src="/images/pin.png"
              link={response.contact[0].link}
              content={response.contact[0].adres}
              key="3"
            />
          );
          setContactItems(temp);
        });
    }
  }, [location]);
  useEffect(() => {
    fetch(`${url}`)
      .then((response) => response.json())
      .then((response) => {
        let temp = [];
        response.data.buildings.forEach((building) => {
          let tempId = building.link;
          let splitId = tempId.split("/");
          if (building.link.includes("http")) {
            temp.push(
              <a
                className="page-select-btn"
                href={building.link}
                target="_blank"
                key={building.name}
              >
                {building.name}
              </a>
            );
          } else {
            temp.push(
              <Link
                className="page-select-btn"
                to={building.link}
                key={building.name}
                id={splitId[2]}
                onClick={unfoldMenu}
              >
                {building.name}
              </Link>
            );
          }
        });
        setBuildings(temp);
        temp = [];
        response.data.navigation.forEach((item) => {
          if (item[0].type == "link") {
            if (item[0].linkType == "outside") {
              temp.push(
                <a href={item[0].path} target="_blank" key={item[0].path}>
                  {item[0].nazwa}
                </a>
              );
            } else {
              temp.push(
                <Link to={item[0].path} key={item[0].path} onClick={unfoldMenu}>
                  {item[0].nazwa}
                </Link>
              );
            }
          } else if (item[0].type == "dropdown") {
            temp.push(<Dropdown tab={item} key={item[0].path} />);
          }
        });
        setMenu(temp);
      });
  }, []);

  const navigate = useNavigate();

  const submitSearch = (e) => {
    e.preventDefault();
    const keywords = document.querySelector("#keywordInput").value;
    if (keywords) navigate(`/szukaj/${keywords}`);
  };

  useEffect(() => {
    window.addEventListener("resize", calcHeight);
    return () => {
      window.removeEventListener("resize", calcHeight);
    };
  });

  return (
    <header className="menu" onLoad={calcHeight}>
      <div className="upper_nav_container">
        <div className="logo_container">
          <Link to={"/"} className={"logo-link"}>
            <img src="/images/CKZIU.svg" alt="logo" />
          </Link>
          <h1>
            Centrum Kształcenia <br /> Zawodowego i Ustawicznego <br /> w
            Brodnicy
          </h1>
        </div>
        <div className="mobile-toggle-btn-cnt">
          <button className="mobile-toggle-btn" onClick={unfoldMenu}>
            <div className="mobile-toggle-bars">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </button>
        </div>
        <div className="contact_nav_container">
          <div className="contact_container">
            {contactItems.map((item) => {
              return item;
            })}
            <a rel="noopener" className="contact_item">
              <span>Czcionka: </span>
              <button
                id="add"
                className="font-btn"
                onClick={(e) => changeFont(e.target.id)}
              >
                A+
              </button>
              <button
                id="rem"
                className="font-btn"
                onClick={(e) => changeFont(e.target.id)}
              >
                A-
              </button>
            </a>
            <a rel="noopener" className="contact_item">
              <button className="font-btn" onClick={switchContrast}>
                <img src="/images/contrast.svg" />
              </button>
              <span>Kontrast: </span>
            </a>
            <div className="flags">
              <img src="/images/orzel.png" alt="godlo" />
              <img src="/images/jelonek.png" alt="godlo" />
            </div>
          </div>
          <nav className="upper_nav">
            {menu.map((navItem) => {
              return navItem;
            })}
            <form
              className="searchbar"
              onSubmit={(event) => submitSearch(event)}
            >
              <input type={"text"} placeholder="Szukaj" id={"keywordInput"} />
              <button type={"submit"}>
                <img src={"/images/search.svg"} />
              </button>
            </form>
          </nav>
        </div>
      </div>
      <div className="bottom_nav_container">
        <nav className="bottom_nav">
          <Link className="page-select-btn active-page-btn" to="/" id="glowna">
            strona główna
          </Link>
          {buildings.map((item) => {
            return item;
          })}
        </nav>
      </div>
      <div className="mobile_menu disabled-menu">
        <div className="mobile-menu-content">
          {menu.map((navItem) => {
            return navItem;
          })}
          {buildings.map((item) => {
            return item;
          })}
        </div>
        <div className="functions-cnt">
          <button className="font-btn" onClick={switchContrast}>
            <img src="/images/contrast.svg" />
          </button>
          <div className="mobile-font-change">
            <button
              id="add"
              className="font-btn"
              onClick={(e) => changeFont(e.target.id)}
            >
              A+
            </button>
            <button
              id="rem"
              className="font-btn"
              onClick={(e) => changeFont(e.target.id)}
            >
              A-
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
