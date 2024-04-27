import * as cheerio from "cheerio";

async function getHTML(url) {
  const response = await fetch(url);
  return response.text();
}

async function dlMediafire(link) {
  const html = await getHTML(link);
  const $ = cheerio.load(html);
  const downloadLink = $("a.input.popsok").attr("href");

  const buffer = await fetch(downloadLink, {
    method: "GET",
  })
    .then((res) => res.blob())
    .then(async (blob) => {
      const data = await blob.arrayBuffer();
      const buffer = Buffer.from(data);
      return buffer;
    });

  return buffer;
}

export default dlMediafire;
