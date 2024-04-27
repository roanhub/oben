const Jimp = require("jimp");

async function gCard(buffer_, nombre) {
  const card_mask = await Jimp.read("./src/img/card_mask.png");
  const card_bg = await Jimp.read("./src/img/card_bg.png");
  const perfil = (await Jimp.read(buffer_)).resize(80, 80).circle(2);
 

//   const img = await card_bg.mask(card_mask, 0, 0);
  // .writeAsync("opo.png")

  card_bg
    .composite(await perfil, 90, 130)
    .print(await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE), 180, 130, nombre)
    .print(await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE), 180, 170, "by @roanh")
    .mask(card_mask, 0, 0)
    .write("card2334.png");

}

module.exports = gCard;
