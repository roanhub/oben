const Jimp = require("jimp");

async function textToSticker(text) {
  const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE); // Fuente del texto (cargar)
  const wt = Jimp.measureText(font, text); // Ancho del texto
  const ht = Jimp.measureTextHeight(font, text, wt); // Alto del texto
  const wimg = 400; // Ancho de la imagen
  const himg = 400; // Alto de la imagen

  const img = new Jimp(wimg, himg, (err, img) => {
    if (err) throw err;
    return img;
  }); // Crear imagen

  const re = img.print(font, (wimg - wt) / 2, (himg - ht) / 2, text, wimg); // Imprimir texto en la imagen
  const base64 = await re
    .getBase64Async(Jimp.MIME_PNG)
    .then((data) => {
      return data.replace(/^data:image\/\w+;base64,/, ""); // Devuelve el valor base64 (formateado)
    })
    .catch((err) => console.error(err));

  return base64; // Devuelve el valor base64
}

module.exports = textToSticker;
