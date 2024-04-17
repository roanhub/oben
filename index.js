import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const client = new Client({
  authStrategy: new LocalAuth(),
});

client
  .on("qr", (qr) => qrcode.generate(qr, { small: true }))
  .on("ready", () => console.log("Client is ready!"))
  .on("message_create", (msg) => {
    console.log(msg.body);
  });

client.initialize();
