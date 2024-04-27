import { client, MessageMedia } from "./clientWApp.cjs";
import qrcode from "qrcode-terminal";
import axios from "axios";
import fs from "fs";

// Comandos
import resizeImage from "./src/commands/stickers.cjs";
import textToSticker from "./src/commands/textToSticker.cjs";
import sourceAnime from "./src/commands/source.cjs";
import gCard from "./src/commands/generadorCard.cjs";
import proCard from "./src/commands/promoteCard.cjs";

// Herramientas
import getPic from "./src/utils/downloadsPinture.mjs";
import bToIGMB64 from "./src/utils/imgB64.mjs";
import dlMediafire from "./src/utils/downloadsMediafire.mjs";

try {
  client
    .on("qr", (qr) => qrcode.generate(qr, { small: true }))
    .on("ready", () => console.log("Client is ready!"))
    .on("message_create", async (msg) => {
      const chat = await msg.getChat();
      console.log(msg.body);

      try {
        if (msg.body.startsWith("!start")) {
          const media = MessageMedia.fromFilePath("./src/img/logo.png");
          await msg.reply(media, msg.from, {
            caption: `Hola ${
              (
                await msg.getContact()
              ).pushname
            }, soy Oben, un bot de WhatsApp creado por @roanh. \n\nPara ver mis comandos escribe !help`,
          });
        } else if (msg.body.startsWith("!s")) {
          if (msg.hasQuotedMsg) {
            const img = await msg.getQuotedMessage(); // Obtener mensaje citado
            const imgToSticker = await img.downloadMedia(); // Descargar imagen del mensaje citado
            const base64 = await resizeImage(imgToSticker); //  procesar imagen
            const media = new MessageMedia("image/png", base64); // Crear objeto de imagen

            await msg
              .reply(media, chat.id._serialized, {
                sendMediaAsSticker: true,
                stickerAuthor: "Oben",
                stickerName: "oben.wabot.com",
              })
              .then(() => console.log("Sticker enviado con exito!"))
              .catch((error) => console.log(error)); // Enviar sticker
          } else {
            const img = await msg.downloadMedia(); // Descargar imagen del mensaje
            const base64 = await resizeImage(img); //  procesar imagen
            const media = new MessageMedia("image/png", base64); // Crear objeto de imagen

            await msg
              .reply(media, chat.id._serialized, {
                sendMediaAsSticker: true,
                stickerAuthor: "Oben",
                stickerName: "oben.wabot.com",
              })
              .then(() => console.log("Sticker enviado con exito!"))
              .catch((error) => console.log(error)); // Enviar sticker
          }
        } else if (msg.body.startsWith("!tts")) {
          const text = msg.body.replace("!tts", "").trim(); // Obtener texto del mensaje
          const base64 = await textToSticker(text); //  procesar imagen
          const media = new MessageMedia("image/png", base64); // Crear objeto de imagen

          await msg
            .reply(media, msg.from, {
              sendMediaAsSticker: true,
              stickerAuthor: "Oben",
              stickerName: "oben.wabot.com",
            })
            .then(() => console.log("Sticker enviado con exito!"))
            .catch((error) => console.log(error)); // Enviar sticker
        } else if (msg.body.startsWith("!ban")) {
          const chat = await msg.getChat();
          if (chat.isGroup) {
            let admins = [];
            const contact = await msg.getMentions();

            await chat.participants.forEach((participant) => {
              participant.isAdmin
                ? admins.push(participant.id._serialized)
                : null;
            });
            console.log(admins);
            console.log(msg.author);
            if (
              admins.includes(msg.author) ||
              msg.author == "18094138873:27@c.us"
            ) {
              if (contact.length > 1) {
                contact.forEach(async (contact) => {
                  await chat.removeParticipants([contact.id._serialized]);
                });
              } else {
                await chat.removeParticipants([contact[0].id._serialized]);
              }
            } else {
              await msg.reply("Este comando solo lo pueden usar los admins.");
            }
          } else {
            await msg.reply("Este comando solo se puede usar en grupos!");
          }
        } else if (msg.body.startsWith("!kick")) {
          const chat = await msg.getChat();
          if (chat.isGroup) {
            let admins = [];

            await chat.participants.forEach((participant) => {
              participant.isAdmin
                ? admins.push(participant.id._serialized)
                : null;
            });

            if (
              admins.includes(msg.author) ||
              msg.author == "18094138873:27@c.us"
            ) {
              if (msg.hasQuotedMsg) {
                const quotedMsg = await msg.getQuotedMessage();
                const contact = await quotedMsg.getContact();
                console.log(contact);

                await chat.removeParticipants([contact.id._serialized]);
                quotedMsg.delete(true);
              } else {
                await msg.reply(
                  "Este comando solo funciona citando el mensaje de la persona que quieres eliminar.!"
                );
              }
            } else {
              await msg.reply("Este comando solo lo pueden usar los admins.");
            }
          } else {
            await msg.reply("Este comando solo se puede usar en grupos!");
          }
        } else if (msg.body.startsWith("!quitar")) {
          const chat = await msg.getChat();
          const admins = await chat.participants;
          const contact = await msg.getMentions();
          if (chat.isGroup) {
            await chat.demoteParticipants([contact[0].id._serialized]);
          } else {
            await msg.reply("Este comando solo se puede usar en grupos!");
          }
        } else if (msg.body.startsWith("!add")) {
          const chat = await msg.getChat();
          const num = msg.body
            .replace("!add", "")
            .replace(/\s/g, "")
            .replace(/-/g, "");
          const arrayNum = num.split(",").map((num) => `${num}@c.us`);
          if (chat.isGroup) {
            if (arrayNum.length > 1) {
              await chat.addParticipants(arrayNum);
              console.log(arrayNum);
            } else {
              await chat.addParticipants(arrayNum[0]);
              console.log(arrayNum);
            }
          } else {
            await msg.reply("Este comando solo se puede usar en grupos!");
          }
        } else if (msg.body.startsWith("!promote")) {
          const chat = await msg.getChat();
          const num = await msg.getMentions();

          if (chat.isGroup) {
            if (num.length > 1) {
              num.forEach(async (contact) => {
                await chat.promoteParticipants([contact.id._serialized]);
              });
            } else {
              const numPro = num[0].id._serialized;
              const numAdmin =
                msg.author == "18094138873:27@c.us"
                  ? "18094138873@c.us"
                  : msg.author;
              const name = await num[0].pushname;
              const picUrl = await num[0].getProfilePicUrl();
              const pic = await getPic(picUrl);
              const imgB64 = await proCard(pic, name);
              console.log(imgB64);

              await chat.promoteParticipants([numPro]);
              const media = new MessageMedia("image/png", imgB64);
              await msg.reply(media, chat.id._serialized, {
                caption: `*@${numPro.replace(
                  "@c.us",
                  ""
                )}* ha sido promovido por: \`@${numAdmin.replace(
                  "@c.us",
                  ""
                )}\``,
                mentions: [numPro, numAdmin],
              });
            }
          } else {
            await msg.reply("Este comando solo se puede usar en grupos!");
          }
        } else if (msg.body.toLocaleLowerCase().startsWith("jambalaya")) {
          const getQuoteImg = await msg.getQuotedMessage();
          const media = await getQuoteImg.downloadMedia();
          await msg.reply(media, msg.author, {
            caption: "toma pillino",
          });
        } else if (msg.body.startsWith("!name")) {
          if (msg.hasQuotedMsg) {
            const chat = await msg.getChat();
            // const limit = msg.body.replace("!name", "").trim();
            const quotedMsg = await msg.getQuotedMessage();
            const media = await quotedMsg.downloadMedia();
            const buffer = Buffer.from(media.data, "base64");

            const res = await sourceAnime(buffer);
            console.log(res);
            const media2 = await MessageMedia.fromUrl(res.image);
            await msg.reply(media2, chat.id._serialized, {
              caption: `*Probabilidad:* \`${Math.round(
                res.similarity * 100
              )}%\`\n\n*Nombre:* \`${res.filename}\`\n\n*ID de AniList:* \`${
                res.anilist
              }\``,
            });

            // console.log(media.data);/
          } else {
            const chat = await msg.getChat();
            const media = await msg.downloadMedia();
            // const limit = msg.body.replace("!name", "").trim();

            const buffer = Buffer.from(media.data, "base64");
            const res = await sourceAnime(buffer);
            console.log(res);
            const media2 = await MessageMedia.fromUrl(res.image);
            await msg.reply(media2, chat.id._serialized, {
              caption: `*Probabilidad:* \`${Math.round(
                res.similarity * 100
              )}%\`\n\n*Nombre:* \`${res.filename}\`\n\n*ID de AniList:* \`${
                res.anilist
              }\``,
            });
          }
        } else if (msg.body.startsWith("!card")) {
          const chat = await msg.getChat();
          const contact = await msg.getContact();
          // const perfil_img_url = await contact.getProfilePicUrl();
          const perfil_img_url = await contact.getProfilePicUrl();
          const nombre = msg.body.replace("!card", "").trim();
          const perfil_img = await axios
            .get(perfil_img_url, {
              responseType: "arraybuffer",
            })
            .then((response) => Buffer.from(response.data, "binary"))
            .catch((error) => console.log(error));

          console.log(perfil_img);
          // fs.writeFileSync("./src/img/perfil2.png", perfil_img);
          await gCard(perfil_img, nombre);
        } else if (msg.body.includes("https://chat.whatsapp.com")) {
          const contact = msg.author;
          const msgId = msg.id;
          await chat.removeParticipants([contact]);
          await msg.delete(true);

          console.log(contact, msgId);
        } else if (msg.body.startsWith("!dl")) {
          const link = msg.body.replace("!dl", "").trim();
          const buffer = await dlMediafire(link);
          const base64 = buffer.toString("base64");

          console.log(base64);

          const media = new MessageMedia("application/pdf", base64);
          await msg.reply(media);
        } else if (msg.body.startsWith("!todos")) {
          if (chat.isGroup) {
            const texto = msg.body.replace("!todos", "").trim();
            const participants = await chat.participants;
            const participantsArray = await participants.map(
              (p) => p.id._serialized
            );

            console.log(participantsArray);
            await msg.delete(true);
            await chat.sendMessage(texto, {
              mentions: participantsArray,
            });
          } else {
            await msg.reply("Este comando solo se puede usar en grupos!");
          }
        }
      } catch (error) {
        console.log(error);
      }
    });

  try {
    client.on("group_join", async (msg) => {
      const grupo = await msg.getChat();
      const memberJoin = msg.recipientIds[0];
      const contact = await client.getContactById(memberJoin);
      const perfil_img_url = await contact.getProfilePicUrl();
      const picBuffer = await getPic(perfil_img_url);

      if (picBuffer === null) {
        await grupo.sendMessage(
          `*@${memberJoin.replace("@c.us", "")}* bienvenido a *${
            grupo.name
          }*\n\n${grupo.groupMetadata.desc}`,
          {
            mentions: [memberJoin],
          }
        );
      } else {
        const imgB64 = await bToIGMB64(picBuffer);
        if (imgB64 === null) {
          await grupo.sendMessage(
            `*@${memberJoin.replace("@c.us", "")}* bienvenido a *${
              grupo.name
            }*\n\n${grupo.groupMetadata.desc}`,
            {
              mentions: [memberJoin],
            }
          );
        } else {
          const media = new MessageMedia("image/png", imgB64);
          // console.log(msg);
          console.log(grupo);

          await grupo.sendMessage(media, {
            caption: `*@${memberJoin.replace("@c.us", "")}* bienvenido a *${
              grupo.name
            }*\n\n${grupo.groupMetadata.desc}`,
            mentions: [memberJoin],
          });
        }
      }
    });
  } catch (error) {
    console.error(error);
  }

  client.initialize();
} catch (error) {
  console.log(error);
}
