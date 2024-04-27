const jimp = require("jimp");

async function proCard(picUrl, nombre) {
  try {
    const perfil = (await jimp.read(picUrl)).resize(50, 50).circle();
    const img = await jimp.create(300, 100, 0x00000000);
    const gato = (await jimp.read("./src/img/gato.png")).resize(50, 25);
    //   await gato.cover(gato.bitmap.width, gato.bitmap.height)

    const font = await jimp.loadFont(jimp.FONT_SANS_16_BLACK);
    const wf = jimp.measureText(font, nombre);
    const hf = jimp.measureTextHeight(font, nombre, wf);

    const frase = "Ahora es admin.";
    const fontFrase = await jimp.loadFont(jimp.FONT_SANS_12_BLACK);
    const wFrase = jimp.measureText(fontFrase, frase);
    const hFrase = jimp.measureTextHeight(fontFrase, frase, wFrase);

    const base64 = await img
      .composite(
        perfil,
        (img.bitmap.width - 50) / 2,
        (img.bitmap.height - 50) / 2 - 20
      )
      .composite(gato, 10, (img.bitmap.height - gato.bitmap.height) / 2)
      .print(
        font,
        (img.bitmap.width - wf) / 2,
        (img.bitmap.height - hf) / 2 + 15,
        nombre
      )
      .composite(
        gato,
        img.bitmap.width - gato.bitmap.width - 10,
        (img.bitmap.height - gato.bitmap.height) / 2
      )
      .print(
        font,
        (img.bitmap.width - wf) / 2,
        (img.bitmap.height - hf) / 2 + 15,
        nombre
      )
      .print(
        fontFrase,
        (img.bitmap.width - wFrase) / 2,
        (img.bitmap.height - hFrase) / 2 + 30,
        frase
      )
      .getBase64Async(jimp.MIME_PNG);

    return base64.replace(/^data:image\/\w+;base64,/, "");
  } catch (error) {
    console.log(error);
    return null;
  }
}

// proCard(nombre);

module.exports = proCard;
