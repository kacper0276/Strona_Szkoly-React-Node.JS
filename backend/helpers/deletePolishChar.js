const DeletePolishChar = (data) => {
  return data
    .replaceAll(/ą/g, "a")
    .replaceAll(/Ą/g, "A")
    .replaceAll(/ć/g, "c")
    .replaceAll(/Ć/g, "C")
    .replaceAll(/ę/g, "e")
    .replaceAll(/Ę/g, "E")
    .replaceAll(/ł/g, "l")
    .replaceAll(/Ł/g, "L")
    .replaceAll(/ń/g, "n")
    .replaceAll(/Ń/g, "N")
    .replaceAll(/ó/g, "o")
    .replaceAll(/Ó/g, "O")
    .replaceAll(/ś/g, "s")
    .replaceAll(/Ś/g, "S")
    .replaceAll(/ż/g, "z")
    .replaceAll(/Ż/g, "Z")
    .replaceAll(/ź/g, "z")
    .replaceAll(/Ź/g, "Z");
};

module.exports = DeletePolishChar;
