import { useEffect } from "react";
import setTitle from "../functions/set-title";

const NotFound = () => {
  useEffect(() => {
    setTitle("Nie znaleziono strony");
  }, []);

  return (
    <div className="first_page_news_cnt" style={{ height: `100vh` }}>
      <h1>Nie znaleziono strony</h1>
    </div>
  );
};

export default NotFound;
