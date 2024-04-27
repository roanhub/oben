const Jimp = require("jimp");

async function resizeImage(image) {
  const width = 400;
  const height = 400;

  try {
    const mask = await Jimp.read("./src/img/mask.png"); // leer mascara
    const imgToBase64 = image.data.replace(/^data:image\/\w+;base64,/, ""); //  limpiar la cadena base64
    const imgToBuffer = Buffer.from(imgToBase64, "base64"); // convertir la cadena base64 a buffer
    const img = await Jimp.read(imgToBuffer); // leer imagen a partir del buffer

    const re = await img
      .cover(width, height)
      .resize(width, height)
      .mask(mask, 0, 0); // aplicar efectos

    const base64 = await re.getBase64Async(Jimp.MIME_PNG); // obtener del buffer el valor base64

    return base64.replace(/^data:image\/\w+;base64,/, ""); // Devuelve el valor base64
  } catch (error) {
    console.error(error);
    throw error; // Lanza el error para que pueda ser manejado externamente si es necesario
  }
}

module.exports = resizeImage;
