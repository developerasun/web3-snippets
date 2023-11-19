const openpgp = require("openpgp");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

const privateKey = fs.readFileSync("./pk.key", { encoding: "utf-8" });
const _privateKey = process.env.PGP_PK_KEY ?? "";
const myMessage = fs.readFileSync("./message.asc", { encoding: "utf-8" });

(async () => {
  const target = await openpgp.readMessage({
    armoredMessage: myMessage,
  });

  console.log({ target });

  const readPkKey = await openpgp.readPrivateKey({ armoredKey: privateKey });
  const _readPkKey = await openpgp.readPrivateKey({ armoredKey: _privateKey });

  const { data } = await openpgp.decrypt({
    message: target,
    decryptionKeys: _readPkKey,
  });

  console.log({ data });
})();
