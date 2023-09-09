import axios from "axios";
import { useEffect, useState } from "react";
import { url } from "../App";
import { useLocation } from "react-router-dom";
import EditNews from "./editNews";

export default function DeleteNews() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState("");
  const [editShow, setEditShow] = useState(false);
  const [editId, setEditId] = useState(null);

  async function fetchNews() {
    axios.get(`${url}/getarticle`).then((res) => {
      setData(res.data.data);
      setLoading(false);
    });
  }

  const deleteNews = async (e, id) => {
    e.preventDefault();

    axios
      .post(
        `${url}/deletearticle/${id}`,
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
          setMsg(res.data.message);
        }
        fetchNews();
      });
  };

  useEffect(() => {
    fetchNews();
  }, [location]);

  return (
    <>
      {editShow ? (
        <EditNews id={editId} changeVisibility={setEditShow} />
      ) : (
        <div className="add-news-panel">
          <form encType="multipart/form-data">
            {loading ? (
              <p>Ładowanie danych...</p>
            ) : (
              <table>
                <thead>
                  <tr style={{ fontSize: "23px" }}>
                    <th>ID:</th>
                    <th>Nazwa</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((news, key) => {
                    return (
                      <tr key={key}>
                        <td>{news.id}</td>
                        <td>{news.title}</td>
                        <td>
                          <button
                            className="footer-delete-button"
                            onClick={(e) => {
                              if (
                                window.confirm(
                                  "Na pewno chcesz usunąć ten rekord?"
                                )
                              ) {
                                deleteNews(e, news.id);
                              }
                            }}
                          >
                            - Usuń Aktualność
                          </button>
                        </td>
                        <td>
                          <button
                            className="footer-delete-button"
                            onClick={(e) => {
                              setEditId(news.id);
                              setEditShow(true);
                            }}
                          >
                            - Edytuj Aktualność
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
