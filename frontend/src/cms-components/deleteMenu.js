import axios from "axios";
import { useLocation } from "react-router-dom";
import { url } from "../App";
import { useEffect, useState } from "react";
import EditMenu from "./editMenu";

export default function DeleteMenu() {
  const location = useLocation();
  const [menuLvl1, setMenuLvl1] = useState([]);
  const [actualLvl1Element, setActualLvl1Element] = useState("");
  const [menuLvl1Loading, setMenuLvl1Loading] = useState(true);
  const [elementsInLvl1, setElementsInLvl1] = useState([]);
  const [elementsInLvl1Loading, setElementsInLvl1Loading] = useState(true);
  const [msg, setMsg] = useState("");
  const [editShow, setEditShow] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchMenuElement = async () => {
    axios.get(`${url}/getlvl1`).then((res) => {
      setMenuLvl1(res.data.menu);
      setMenuLvl1Loading(false);
      setActualLvl1Element(res.data.menu[0].glowny);
    });
  };

  async function deleteMenu(e, id) {
    e.preventDefault();

    axios
      .post(
        `${url}/deletelvl1menu/${id}`,
        {},
        {
          headers: {
            accessToken: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        if (res.data.error) {
          setMsg(res.data.error);
        } else {
          setMsg(res.data.msg);
        }
        fetchElementsInLvl1(actualLvl1Element);
      });
  }

  const fetchElementsInLvl1 = async (main) => {
    axios.get(`${url}/getdetailslvl1/${main}`).then((res) => {
      setElementsInLvl1(res.data.data);
      setElementsInLvl1Loading(false);
    });
  };

  useEffect(() => {
    fetchMenuElement();
  }, [location]);

  useEffect(() => {
    if (actualLvl1Element !== "") {
      fetchElementsInLvl1(actualLvl1Element);
    }
  }, [actualLvl1Element]);

  return (
    <>
      {editShow ? (
        <EditMenu id={editId} setEditShow={setEditShow} />
      ) : (
        <div className="adduser-panel-cnt">
          <h1>Usuwanie Zawartości Z Menu</h1>
          <form>
            <h3>Z Jakiego Menu Chcesz Usunąć</h3>
            {menuLvl1Loading ? (
              <p>Ładowanie danych...</p>
            ) : (
              <select
                onChange={(e) => {
                  setActualLvl1Element(e.target.value);
                }}
              >
                {menuLvl1.map((elMenuLvl1, key) => {
                  return (
                    <option value={elMenuLvl1.glowny} key={key}>
                      {elMenuLvl1.nazwa}
                    </option>
                  );
                })}
              </select>
            )}
            {elementsInLvl1Loading ? null : (
              <table>
                <thead>
                  <tr>
                    <th>ID:</th>
                    <th>Nazwa</th>
                  </tr>
                </thead>
                <tbody>
                  {elementsInLvl1.map((elementInLvl1, key) => {
                    return (
                      <tr key={key}>
                        <td>{elementInLvl1.id}</td>
                        <td>{elementInLvl1.nazwa}</td>
                        <td>
                          <button
                            className="footer-delete-button"
                            onClick={(e) => {
                              if (
                                window.confirm(
                                  "Na pewno chcesz usunąć ten rekord?"
                                )
                              ) {
                                deleteMenu(e, elementInLvl1.id);
                              }
                            }}
                          >
                            - Usuń Element W Menu
                          </button>
                        </td>
                        <td>
                          <button
                            className="footer-delete-button"
                            onClick={(e) => {
                              setEditId(elementInLvl1.id);
                              setEditShow(true);
                            }}
                          >
                            - Edytuj Element W Menu
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </form>
          {msg ? (
            <div className="msg-div">
              <div className="button-close" onClick={(e) => setMsg("")}>
                <span></span>
                <span></span>
              </div>
              {msg}
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
