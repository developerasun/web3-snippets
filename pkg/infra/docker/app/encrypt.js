const openpgp = require("openpgp");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

const envSecret = process.env.ENV_SECRET ?? "not detected";
const superSecret = "all is well" ?? "not detected";

const publicKey = fs.readFileSync("./pub.key", { encoding: "utf8" });
const privateKey = fs.readFileSync("./pk.key", { encoding: "utf8" });

(async () => {
  const readPubKey = await openpgp.readKey({ armoredKey: publicKey });
  const readPkKey = await openpgp.readPrivateKey({ armoredKey: privateKey });

  const message = await openpgp.createMessage({ text: envSecret, format: "text" });

  const encrypted = await openpgp.encrypt({
    message,
    encryptionKeys: readPubKey,
  });

  const target = await openpgp.readMessage({
    armoredMessage: encrypted,
  });

  const { data } = await openpgp.decrypt({
    message: target,
    decryptionKeys: readPkKey,
  });

  console.log({ data });
})();

// (async () => {
//   const { privateKey, publicKey } = await openpgp.generateKey({ curve: "curve25519", userIDs: [{ name: "jake", email: "nellow1102@gmail.com" }] }); // returns armored value

//   const readPubKey = await openpgp.readKey({ armoredKey: publicKey });
//   console.log(await readPubKey.getPrimaryUser());

//   const readPkKey = await openpgp.readPrivateKey({ armoredKey: privateKey });

//   const message = await openpgp.createMessage({ text: superSecret, format: "text" });

//   const encrypted = await openpgp.encrypt({
//     message,
//     encryptionKeys: readPubKey,
//   });

//   console.log({ encrypted });

//   const target = await openpgp.readMessage({
//     armoredMessage: encrypted,
//   });

//   const { data } = await openpgp.decrypt({
//     message: target,
//     decryptionKeys: readPkKey,
//   });

//   console.log({ data });
// })();

// create key pair and export it.
// (async () => {
//   const { privateKey, publicKey } = await openpgp.generateKey({ curve: "curve25519", userIDs: [{ name: "jake", email: "nellow1102@gmail.com" }] }); // returns armored value
//   fs.writeFileSync(`${process.cwd()}/pub.key`, publicKey);
//   fs.writeFileSync(`${process.cwd()}/pk.key`, privateKey);
// })();

// encrypt message
(async () => {
  const _message = fs.readFileSync("../secret/message.txt", { encoding: "utf-8" });

  console.log({ _message });

  const readPubKey = await openpgp.readKey({ armoredKey: publicKey });
  const message = await openpgp.createMessage({ text: _message, format: "text" });

  const encrypted = await openpgp.encrypt({
    message,
    encryptionKeys: readPubKey,
  });

  fs.writeFileSync("./message.asc", encrypted);
})();
