//Router
import { useEffect, useReducer, useState } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
//Import components
import Navbar from "./components/navbar";
import Footer from "./components/footer";
//Pages
import Mainpage from "./pages/mainpage";
import SchTemplate from "./pages/schoolpg";
import NewsPage from "./pages/newspage";
import SearchResult from "./pages/searchresult";
import calcHeight from "./functions/calcheight";
import Content from "./pages/content";
import ReadMore from "./pages/read-more";
import CMS from "./cms";
import Cookies from "./components/cookies";
import Authors from "./authors";
import { initialState, reducer } from "./reducer";
import LoginContext from "./context/LoginContext";
import Layout from "./Layout/Layout";
import FooterGallery from "./Layout/Footer/Footer";
import MainPage from "./pages/MainPage/MainPage";
import Gallery from "./pages/Gallery/Gallery";
import AlbumsInSchoolYear from "./pages/Gallery/AlbumsInSchoolYear/AlbumsInSchoolYear";
import PhotosInGallery from "./pages/Gallery/PhotosInGallery/PhotosInGallery";
import LoginPage from "./pages/LoginPage/LoginPage";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import AuthtenticatedRoute from "./hok/AuthenticatedRoute";
import NotFound from "./pages/notfound";
// export const url = window.location.origin+'/api';
// export const url = "http://strona2022.ckziubrodnica.pl/api";
export const url = "https://ckziubrodnica.pl/api";
// export const url = 'http://localhost:3001/api';
// export const url = 'http://192.168.100.2:3002/api';
// export const url = "http://localhost:8080/api";

const App = () => {
  // useEffect(()=>{
  //   if(!window.location.href.includes('admin')){
  //   window.addEventListener('resize',calcHeight);
  //   return ()=>{
  //       window.removeEventListener('resize',calcHeight);
  //   };
  //   }
  // });

  // setTimeout(calcHeight,0);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [cookieInfo, setCookieInfo] = useState();

  useEffect(() => {
    if (document.cookie.includes("infoCookie=true")) {
      setCookieInfo("");
    } else {
      setCookieInfo(<Cookies />);
      document.cookie =
        "infoCookie = true;expires=Tue, 19 Jan 2038 03:14:07 UTC";
    }
  }, []);

  return (
    <>
      <LoginContext.Provider
        value={{
          state: state,
          dispatch: dispatch,
        }}
      >
        <Router>
          <Routes>
            <Route path="/admin" element={<CMS />} />
            <Route path="/authors" element={<Authors />} />
            <Route
              path="/galeria"
              exact
              element={
                <Layout content={<MainPage />} footer={<FooterGallery />} />
              }
            />
            <Route
              path="/galeria/galeria"
              exact
              element={
                <Layout content={<Gallery />} footer={<FooterGallery />} />
              }
            />
            <Route
              path="/galeria/przegladajrok/:year"
              exact
              element={
                <Layout
                  content={<AlbumsInSchoolYear />}
                  footer={<FooterGallery />}
                />
              }
            />
            <Route
              path="/galeria/przegladajalbum/:year/:name"
              exact
              element={
                <Layout
                  content={<PhotosInGallery />}
                  footer={<FooterGallery />}
                />
              }
            />
            <Route
              path="/galeria/zaloguj"
              exact
              element={
                <Layout content={<LoginPage />} footer={<FooterGallery />} />
              }
            />
            <Route
              path="/galeria/paneladmina"
              exact
              element={
                <Layout
                  content={
                    <AuthtenticatedRoute>
                      <AdminPanel />
                    </AuthtenticatedRoute>
                  }
                  footer={<FooterGallery />}
                />
              }
            />
            <Route
              path="*"
              element={
                <>
                  {cookieInfo}
                  <Navbar />
                  <main className="main-slider">
                    <Routes>
                      <Route path="/" element={<Mainpage />} />
                      <Route path="/szkoly/:name" element={<SchTemplate />} />
                      <Route
                        path="/aktualnosci/:name/:page"
                        element={<NewsPage />}
                      />
                      <Route
                        path="/szukaj/:keywords"
                        element={<SearchResult />}
                      />
                      <Route
                        path="/aktualnosci/czytajwiecej/:name/:id"
                        element={<ReadMore />}
                      />
                      <Route path="/content/*" element={<Content />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
        </Router>
      </LoginContext.Provider>
    </>
  );
};
export default App;
