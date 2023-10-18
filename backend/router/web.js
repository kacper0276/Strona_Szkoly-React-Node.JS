const express = require("express");
const router = new express.Router();
const cors = require("cors");
const upload = require("../helpers/uploader.js");
const uploadPhoto = require("../helpers/uploadPhotos");
const uploadYear = require("../helpers/uploadPhotoSchoolYear");
const uploadAlbum = require("../helpers/uploadPhotoAlbum");
const showController = require("../controllers/show-controller.js");
const articleController = require("../controllers/article-controller.js");
const buildingsController = require("../controllers/buildings-controller.js");
const contactsController = require("../controllers/contacts-controller.js");
const footerController = require("../controllers/footer-controller.js");
const menuColorController = require("../controllers/menu-color-controller.js");
const usersController = require("../controllers/users-controller.js");
const photoController = require("../controllers/photo-controller");
const yearController = require("../controllers/year-controller");
const albumController = require("../controllers/album-controller");
const path = require("path");
const { verifyJWT } = require("../middleware/auth-middleware.js");

// Główna
router.get("/api/", cors(), showController.showMainPage);

// Kontakt
router.get("/api/contact/:building", showController.showContact);

// Artykuł szczegóły
router.get(
  "/api/aktualnosci/czytajwiecej/:building/:id",
  cors(),
  showController.showMoreDetailsArticle
);

// Aktualnosci dany budynek i wszystkie
router.get(
  "/api/aktualnosci/:building",
  cors(),
  showController.showPaginateArticle
);

// Szukajka
router.post("/api/szukaj", cors(), showController.searchHandler);

// Logowanie użytkowników
router.post("/api/logowanie", cors(), usersController.login);

// Rejestracja użytkowników
router.post("/api/adduser", verifyJWT, cors(), usersController.register);

// Usuwanie użytkowników
router.post("/api/deluser/:id", verifyJWT, cors(), usersController.delete);

// Lista użytkowników
router.get("/api/allusers", verifyJWT, cors(), usersController.showUsers);

// Edycja danych użytkownika
router.post("/api/edituser/:id", verifyJWT, cors(), usersController.edit);

// Wyświetlenie budynków
router.get("/api/buildinglist", cors(), articleController.sendBuildings);

// Kafle w budynku
router.get("/api/szkoly/:building", cors(), showController.showBuildingDetails);

// Zawartosc kafli
router.get(
  "/api/content/szkoly/:building/:content",
  cors(),
  showController.showContentInBuilding
);

// Jak wyższy lvl menu u góry
router.get("/api/content/:building/*", cors(), showController.showMenuColor);

// Mapa strony
router.get("/api/content/map", cors(), showController.showMap);

// Dodanie artykułu
router.post(
  "/api/addarticle",
  verifyJWT,
  cors(),
  upload.array("images"),
  articleController.addArticle
);

// Usuwanie arytkułu
router.post(
  "/api/deletearticle/:id",
  verifyJWT,
  cors(),
  articleController.deleteArticle
);

// Pobieranie danych do edycji artykułu
router.get(
  "/api/getdetailstoeditarticle/:id",
  cors(),
  articleController.getDetailsToEdit
);

// Edycja artykułu
router.post(
  "/api/editarticle/:id",
  verifyJWT,
  cors(),
  upload.array("images"),
  articleController.editArticle
);

// Wszystkie artykuły
router.get("/api/getarticle", cors(), articleController.showAllArticle);

// Artykuły zależne od budynku
router.get(
  "/api/getarticlefrombuilding/:building",
  cors(),
  articleController.getArticleSelected
);

// Dodawanie stopki
router.post(
  "/api/addfooter",
  verifyJWT,
  cors(),
  upload.array("image"),
  footerController.addFooter
);

// Usuwanie stopki (dodaj)
router.post(
  "/api/deletefooter/:id",
  verifyJWT,
  cors(),
  footerController.deleteFooter
);

// Wszystkie stopki
router.get("/api/getallfooters", cors(), footerController.allFooter);

// Dodawanie budynku
router.post(
  "/api/addbuilding",
  verifyJWT,
  cors(),
  buildingsController.addBuildings
);

// Usuwanie budynku
router.post(
  "/api/deletebuilding/:id",
  verifyJWT,
  cors(),
  buildingsController.deleteBuildings
);

// Edycja budynku
router.post(
  "/api/editbuilding/:id",
  verifyJWT,
  cors(),
  buildingsController.editBuildings
);

// Pobieranie budynków (Poziom 1 tylko)
router.get(
  "/api/getallbuildings",
  cors(),
  buildingsController.showAllBuildings
);

// Pobieranie szczegółów budynków
router.get(
  "/api/getdetailsbuilding/:namebuilding",
  cors(),
  buildingsController.getDetailsBuilding
);

// Usuwanie szczegółów budynków
router.post(
  "/api/deletebuildingcontent/:id",
  cors(),
  buildingsController.deleteBuildingDetails
);

// Pobieranie kolejności budynków
router.get(
  "/api/getbuildingsequence",
  cors(),
  buildingsController.showSequenceBuildings
);

// Ustawianie kolejności budynków
router.post(
  "/api/setbuildingsequence",
  verifyJWT,
  cors(),
  buildingsController.setSequence
);

router.post(
  "/api/setbuildingcontentsequence/:building",
  verifyJWT,
  cors(),
  buildingsController.setBuildingContentSequence
);

// Pobieranie liczby artykułów na stronie głównej
router.get(
  "/api/getnumbermainpage",
  cors(),
  articleController.getNumberMainPage
);

// Ustawienie liczby artykułów na stronie głównej
router.post(
  "/api/setnumberonmainpage",
  verifyJWT,
  cors(),
  articleController.setNumberMainPage
);

// Menu kolorowe dodawanie poziom1
router.post(
  "/api/addlvl1menu",
  verifyJWT,
  cors(),
  menuColorController.addColorMenu
);

// Menu kolorowe pobieranie poziom1
router.get("/api/getlvl1", cors(), menuColorController.getLvl1);

// Menu kolorowe pobieranie kategorii
router.get("/api/getcategory/:which", cors(), menuColorController.getCategory);

// Menu kolorowe pobieranie 1 rekordu lvl1
router.get(
  "/api/getlvl1Details/:id",
  cors(),
  menuColorController.getDataOneItem
);

// Menu kolorowe pobieranie wszystkiego poza poziom1
router.get(
  "/api/getdetailslvl1/:main",
  cors(),
  menuColorController.getDetailsInLvl1
);

// Menu kolorowe usuwanie poziom1 i reszta
router.post(
  "/api/deletelvl1menu/:id",
  verifyJWT,
  cors(),
  menuColorController.deleteColorMenu
);

// Menu kolorowe dodanie innego poziomu
router.post(
  "/api/addcolormenu",
  verifyJWT,
  cors(),
  menuColorController.addColorMenu
);

// Menu kolorwe edycja
router.post(
  "/api/editmenu/:id",
  verifyJWT,
  cors(),
  menuColorController.editColorMenu
);

// Pobieranie zdjęć używanych w kaflach
router.get("/api/getphotosbuilding", cors(), buildingsController.showAllPhotos);

// Pobieranie pola which z Kontaktów
router.get("/api/getwhichfromcontact", cors(), contactsController.getWhich);

// Pobieranie szczegółów danych po polu which
router.get(
  "/api/getdetailscontact/:which",
  cors(),
  contactsController.getDetailsContact
);

// Pobieranie wszystkich kontaktów
router.get("/api/getallcontacts", cors(), contactsController.getAllContacts);

// Dodawanie kontaktu
router.post(
  "/api/addcontact",
  verifyJWT,
  cors(),
  contactsController.addNewContact
);

// Usuwanie kontaktu
router.post(
  "/api/deletecontact/:id",
  verifyJWT,
  cors(),
  contactsController.deleteContact
);

// Edycja danych kontaktowych
router.post(
  "/api/editcontact",
  verifyJWT,
  cors(),
  contactsController.editContact
);

// Pobieranie danych o konkretnym użytkowniku
router.get(
  "/api/getdetailsuser/:id",
  verifyJWT,
  cors(),
  usersController.getDataFromUser
);

// Pobieranie danych kafla w budynku
router.get(
  "/api/getdetailskafel/:id",
  verifyJWT,
  cors(),
  buildingsController.getDetailsInBuildingOne
);

// Rok szkolny
router.post(
  "/api/stworzrokszkolny",
  verifyJWT,
  uploadYear.array("image"),
  cors(),
  yearController.addYear
);
router.get("/api/rokszkolny", cors(), yearController.getAllYears);

// Stwórz album
router.post(
  "/api/stworzalbum",
  verifyJWT,
  uploadAlbum.array("image"),
  cors(),
  albumController.addAlbum
);
router.get("/api/albumy/:rok", cors(), albumController.getAllAlbumsInYear);

// Zdjęcia do albumu
router.post(
  "/api/dodajzdjecia",
  verifyJWT,
  uploadPhoto.array("images"),
  cors(),
  photoController.addPhotos
);
router.get(
  "/api/zdjeciazalbumu/:year/:name",
  cors(),
  photoController.getPhotosInAlbum
);

// Pobieranie Mini IMG do zdjęcia w usuwaniu
router.get("/api/getimgalbum/:id", cors(), yearController.getMiniImgToDelete);

// Usuwanie rok szkolny zdjęcia
router.post(
  "/api/deleteyear/:id",
  verifyJWT,
  cors(),
  yearController.deleteYear
);

// Pobieranie szczegółów albumu (przy usuwaniu)
router.get(
  "/api/albumy/:schoolYearList/:id",
  cors(),
  albumController.getAlbumDetails
);

// Usuwanie albumu
router.get(
  "/api/deletealbum/:id",
  verifyJWT,
  cors(),
  albumController.deleteAlbum
);

// Usuwanie zdjęć
router.get(
  "/api/deleteimg/:imgname",
  verifyJWT,
  cors(),
  photoController.deleteImage
);

// Edycja zdjęć rok szkolny
router.post(
  "/api/updateYear/:id",
  verifyJWT,
  uploadYear.array("image"),
  cors(),
  yearController.updateYear
);

// Edycja albumów
router.post(
  "/api/editalbum/:id",
  verifyJWT,
  uploadAlbum.array("image"),
  cors(),
  albumController.editAlbum
);

// Edycja zdjęć w albumie
router.post(
  "/api/editphotosinalbum",
  verifyJWT,
  uploadPhoto.array("images"),
  cors(),
  photoController.editImage
);

// Ustawianie kolejności menu lvl1
router.post(
  "/api/setsequencemenulvl1",
  verifyJWT,
  cors(),
  menuColorController.setSequenceMenuLvl1
);

// Pobieranie kolejności w danym menu != lvl1
router.get(
  "/api/getdetailsmenu/:menu",
  cors(),
  menuColorController.getDetailsSequenceMenu
);

// Ustawianie kolejności menu content
router.post(
  "/api/setsequencemenucontent/:which",
  verifyJWT,
  cors(),
  menuColorController.setSequenceMenu
);

router.get("*", cors(), (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

module.exports = router;
