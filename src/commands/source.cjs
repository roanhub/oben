async function sourceAnime(buffer) {
  const response = await fetch("https://api.trace.moe/search", {
    method: "POST",
    body: buffer,
    headers: { "Content-type": "image/jpeg" },
  })
    .then((e) => e.json())
    .then((e) => {
      return e.result[0];
    });

  return response;
}
module.exports = sourceAnime;
