import Jimp from "jimp";

async function bToIGMB64(buffer) {
  try {
    const image = await Jimp.read(buffer);
    const b64 = await image.getBase64Async(Jimp.MIME_PNG);
    return b64.replace(/^data:image\/(png|jpg);base64,/, "");
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default bToIGMB64;
