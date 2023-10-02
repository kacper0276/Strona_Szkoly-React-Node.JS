import { Navigate, useNavigate } from "react-router-dom";
import setTitle from "../functions/set-title";
import { useContext, useEffect, useRef, useState } from "react";
import AddNews from "../cms-components/addNews";
import AddUser from "../cms-components/addUser";
import AddMenuLvl1 from "../cms-components/addMenuLvl1";
import AddFooter from "../cms-components/addFooter";
import AddBuildings from "../cms-components/addBuildings";
import AddBuildinContent from "../cms-components/addBuildingContent";
import SetSequenceInBuilding from "../cms-components/setSequenceInBuilding";
import SetArticleOnMain from "../cms-components/setArticleOnMain";
import AddMenu from "../cms-components/addMenu";
import DeleteBuildingContent from "../cms-components/deleteBuildingContent";
import DeleteNews from "../cms-components/deleteNews";
import DeleteMenu from "../cms-components/deleteMenu";
import EditContact from "../cms-components/editContact";
import AddNewContact from "../cms-components/addNewContact";
import LoginContext from "../context/LoginContext";
import SetSequenceContentInBuilding from "../cms-components/setSequenceContentInBuilding";
import MainPageCMS from "../cms-components/mainPage";
import axios from "axios";
import { url } from "../App";
import SetSequenceMenuColorlvl1 from "../cms-components/setSequenceMenuColorlvl1";
import SetSequenceMenuColor from "../cms-components/setSequenceMenuColor";

const AdminPanel = () => {
  setTitle("Panel Administracyjny");
  const ref = useRef();

  const context = useContext(LoginContext);
  //const cms = useNavigate();

  const logOut = () => {
    sessionStorage.setItem("isLogged", "false");
    localStorage.removeItem("token");
    // cms('/admin');
    window.location.reload();
  };

  const [selectedPanel, setSelectedPanel] = useState(<MainPageCMS />);

  const panels = [
    <AddNews />,
    <DeleteNews />,
    <AddUser />,
    <AddMenuLvl1 />,
    <AddMenu />,
    <DeleteMenu />,
    <AddFooter />,
    <AddBuildings />,
    <AddBuildinContent />,
    <DeleteBuildingContent />,
    <SetSequenceInBuilding />,
    <SetSequenceContentInBuilding />,
    <SetSequenceMenuColorlvl1 />,
    <SetSequenceMenuColor />,
    <SetArticleOnMain />,
    <AddNewContact />,
    <EditContact />,
  ];

  const swapPanel = (id) => {
    setSelectedPanel(panels[id]);
    if (
      +id === 0 ||
      +id === 9 ||
      +id === 4 ||
      +id === 1 ||
      +id === 5 ||
      +id === 10 ||
      +id === 8
    ) {
      ref.current.classList.remove("other-than-news");
    } else {
      ref.current.classList.add("other-than-news");
    }
  };

  const changeActive = (id) => {
    const prev = document.querySelector(".btn-active-cms");
    if (prev) {
      prev.classList.remove("btn-active-cms");
    }
    document.getElementById(id).classList.add("btn-active-cms");
  };

  return (
    <>
      <div className="cms-panel-body">
        <div className="main-cms-cnt">
          <div className="main-cms-topbar-cnt">
            <div className="cms-panel-logo-cnt">
              <img src="./images/CKZIU.svg" alt="Logo CKZiU" />
              <h4>CKZiU</h4>
            </div>
            <button onClick={logOut}>WYLOGUJ</button>
          </div>
          <div className="main-cms-panel-cnt">
            <nav className="main-cms-nav-cnt">
              <div className="cms-nav-title">Opcje panelu</div>

              {(() => {
                if (
                  context.state.userStatus.includes("admin") ||
                  context.state.userStatus.includes("addNews") ||
                  context.state.userStatus.includes("news")
                ) {
                  return (
                    <button
                      className="cms-nav-btn"
                      id="0"
                      onClick={(e) => {
                        swapPanel(e.target.id);
                        changeActive(e.target.id);
                      }}
                    >
                      Dodaj aktualność
                    </button>
                  );
                }
              })()}

              {(() => {
                if (
                  context.state.userStatus.includes("admin") ||
                  context.state.userStatus.includes("news")
                ) {
                  return (
                    <button
                      className="cms-nav-btn"
                      id="1"
                      onClick={(e) => {
                        swapPanel(e.target.id);
                        changeActive(e.target.id);
                      }}
                    >
                      Usuń/Edytuj aktualność
                    </button>
                  );
                }
              })()}

              {(() => {
                if (context.state.userStatus.includes("admin")) {
                  return (
                    <button
                      className="cms-nav-btn"
                      id="2"
                      onClick={(e) => {
                        swapPanel(e.target.id);
                        changeActive(e.target.id);
                      }}
                    >
                      Dodaj/Usuń użytkownika
                    </button>
                  );
                }
              })()}

              {(() => {
                if (
                  context.state.userStatus.includes("admin") ||
                  context.state.userStatus.includes("menu")
                ) {
                  return (
                    <>
                      <button
                        className="cms-nav-btn"
                        id="3"
                        onClick={(e) => {
                          swapPanel(e.target.id);
                          changeActive(e.target.id);
                        }}
                      >
                        Zarządzanie menu (Poziom 1)
                      </button>
                      <button
                        className="cms-nav-btn"
                        id="4"
                        onClick={(e) => {
                          swapPanel(e.target.id);
                          changeActive(e.target.id);
                        }}
                      >
                        Dodwanie menu (zawartość lub kategoria)
                      </button>
                      <button
                        className="cms-nav-btn"
                        id="5"
                        onClick={(e) => {
                          swapPanel(e.target.id);
                          changeActive(e.target.id);
                        }}
                      >
                        Usuwanie menu (zawartość lub kategoria)
                      </button>
                    </>
                  );
                }
              })()}

              {(() => {
                if (
                  context.state.userStatus.includes("admin") ||
                  context.state.userStatus.includes("footer")
                ) {
                  return (
                    <button
                      className="cms-nav-btn"
                      id="6"
                      onClick={(e) => {
                        swapPanel(e.target.id);
                        changeActive(e.target.id);
                      }}
                    >
                      Zarządzanie stopką
                    </button>
                  );
                }
              })()}

              {(() => {
                if (
                  context.state.userStatus.includes("admin") ||
                  context.state.userStatus.includes("building")
                ) {
                  return (
                    <>
                      <button
                        className="cms-nav-btn"
                        id="7"
                        onClick={(e) => {
                          swapPanel(e.target.id);
                          changeActive(e.target.id);
                        }}
                      >
                        Dodaj/Usuń budynek w menu
                      </button>
                    </>
                  );
                }
              })()}

              {(() => {
                if (
                  context.state.userStatus.includes("admin") ||
                  context.state.userStatus.includes("kafle")
                ) {
                  return (
                    <>
                      <button
                        className="cms-nav-btn"
                        id="8"
                        onClick={(e) => {
                          swapPanel(e.target.id);
                          changeActive(e.target.id);
                        }}
                      >
                        Dodaj kafle w budynku
                      </button>
                      <button
                        className="cms-nav-btn"
                        id="9"
                        onClick={(e) => {
                          swapPanel(e.target.id);
                          changeActive(e.target.id);
                        }}
                      >
                        Usuń/Edytuj kafle w budynku
                      </button>
                      <button
                        className="cms-nav-btn"
                        id="11"
                        onClick={(e) => {
                          swapPanel(e.target.id);
                          changeActive(e.target.id);
                        }}
                      >
                        Edytuj kolejność kafli w budynku
                      </button>
                    </>
                  );
                }
              })()}

              {(() => {
                if (
                  context.state.userStatus.includes("admin") ||
                  context.state.userStatus.includes("sequence")
                ) {
                  return (
                    <>
                      <button
                        className="cms-nav-btn"
                        id="10"
                        onClick={(e) => {
                          swapPanel(e.target.id);
                          changeActive(e.target.id);
                        }}
                      >
                        Edytuj kolejność budynków
                      </button>

                      <button
                        className="cms-nav-btn"
                        id="12"
                        onClick={(e) => {
                          swapPanel(e.target.id);
                          changeActive(e.target.id);
                        }}
                      >
                        Edytuj kolejność menu w poziomie 1
                      </button>
                      <button
                        className="cms-nav-btn"
                        id="13"
                        onClick={(e) => {
                          swapPanel(e.target.id);
                          changeActive(e.target.id);
                        }}
                      >
                        Edytuj kolejność w elementach menu
                      </button>
                    </>
                  );
                }
              })()}

              {(() => {
                if (
                  context.state.userStatus.includes("admin") ||
                  context.state.userStatus.includes("mainCount")
                ) {
                  return (
                    <button
                      className="cms-nav-btn"
                      id="14"
                      onClick={(e) => {
                        swapPanel(e.target.id);
                        changeActive(e.target.id);
                      }}
                    >
                      Edytuj liczbę artykułów na stronie głównej
                    </button>
                  );
                }
              })()}

              {(() => {
                if (
                  context.state.userStatus.includes("admin") ||
                  context.state.userStatus.includes("contact")
                ) {
                  return (
                    <>
                      <button
                        className="cms-nav-btn"
                        id="15"
                        onClick={(e) => {
                          swapPanel(e.target.id);
                          changeActive(e.target.id);
                        }}
                      >
                        Dodaj kontakt do budynku
                      </button>
                      <button
                        className="cms-nav-btn"
                        id="16"
                        onClick={(e) => {
                          swapPanel(e.target.id);
                          changeActive(e.target.id);
                        }}
                      >
                        Edytuj kontakty
                      </button>
                    </>
                  );
                }
              })()}
            </nav>
            <div className="cms-panel-cnt" ref={ref}>
              {selectedPanel}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
