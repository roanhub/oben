import axios from "axios";

async function getPic(urlPic) {
  try {
    const buffer = await axios
      .get(urlPic, {
        responseType: "arraybuffer",
      })
      .then((response) => Buffer.from(response.data, "binary"))
      .catch((error) => console.log(error));

    return buffer;
  } catch (error) {
    return null;
  }
}

export default getPic;
