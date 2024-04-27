const {Client, MessageMedia, LocalAuth} = require("whatsapp-web.js");

const client = new Client({
      authStrategy: new LocalAuth(),
  });

module.exports = {
    client,
    MessageMedia
}