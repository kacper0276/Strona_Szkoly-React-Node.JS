import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../App";
import { useLocation } from "react-router-dom";

export default function AddFooter() {
  const location = useLocation();
  const [companyData, setCompanyData] = useState({
    alt: "",
    odnosnik: "",
    img: null,
  });
  const [message, setMessage] = useState("");
  const [allFooter, setAllFooter] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchFooters() {
    axios.get(`${url}/getallfooters`).then((res) => {
      setAllFooter(res.data.data);
      setLoading(false);
    });
  }
  useEffect(() => {
    fetchFooters();
  }, [location]);

  const createFooter = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("alt", companyData.alt);
    formData.append("odnosnik", companyData.odnosnik);
    formData.append("image", companyData.img);

    axios
      .post(`${url}/addfooter`, formData, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.data.error) {
          setMessage(res.data.error);
        } else {
          setMessage(res.data.msg);
          fetchFooters();
        }
      });
  };

  const deleteFooter = (e, id) => {
    e.preventDefault();
    axios
      .post(
        `${url}/deletefooter/${id}`,
        {},
        {
          headers: {
            accessToken: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        if (res.data.error) {
          setMessage(res.data.error);
        } else {
          setMessage(res.data.msg);
        }

        if (res.data.msg === "Usunięto") {
          fetchFooters();
        }
      });
  };

  return (
    <div className="add-news-panel">
      <form
        onSubmit={(e) => {
          createFooter(e);
        }}
      >
        <h1>Dodaj Firmę Do Stopki</h1>
        <h3>Nazwa Firmy</h3>
        <input
          type={"text"}
          id="companyName"
          required
          onChange={(e) => {
            setCompanyData({ ...companyData, alt: e.target.value });
          }}
        />
        <h3>Link Do Strony Firmy</h3>
        <input
          type={"text"}
          id="linkToCompany"
          required
          onChange={(e) => {
            setCompanyData({ ...companyData, odnosnik: e.target.value });
          }}
        />
        <h3>Zdjęcie Loga Firmy</h3>
        <div className="add-news-panel-btn-cnt">
          <input
            type="file"
            id="companyLogo"
            required
            onChange={(e) => {
              setCompanyData({ ...companyData, img: e.target.files[0] });
            }}
          />
          <input type={"submit"} value={"+ Zapisz"} />
        </div>
      </form>
      <form
        onSubmit={(e) => {
          if (window.confirm("Na pewno chcesz usunąć ten rekord?")) {
            deleteFooter(e);
          }
        }}
      >
        <h1>Usuń Firmę Ze Stopki</h1>
        {loading ? (
          <p>Ładowanie danych ...</p>
        ) : (
          <table>
            <thead>
              <tr style={{ fontSize: "23px" }}>
                <th>ID:</th>
                <th>Nazwa</th>
              </tr>
            </thead>
            <tbody>
              {allFooter.map((footerElement, key) => {
                return (
                  <tr key={key}>
                    <td>{footerElement.id}</td>
                    <td>{footerElement.alt}</td>
                    <td>
                      <button
                        className="footer-delete-button"
                        onClick={(e) => {
                          deleteFooter(e, footerElement.id);
                        }}
                      >
                        - Usuń Stopkę
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </form>
      {message ? (
        <div className="msg-div">
          <div className="button-close" onClick={(e) => setMessage("")}>
            <span></span>
            <span></span>
          </div>
          {message}
        </div>
      ) : null}
    </div>
  );
}
