const openpgp = require("openpgp");
const dotenv = require("dotenv");
dotenv.config()

const envSecret = process.env.ENV_SECRET ?? "not detected";
const superSecret = "all is well" ?? "not detected";

(async () => {
  const { privateKey, publicKey } = await openpgp.generateKey({ curve: "curve25519", userIDs: [{ name: "jake", email: "nellow1102@gmail.com" }] }); // returns armored value

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

(async () => {
  const { privateKey, publicKey } = await openpgp.generateKey({ curve: "curve25519", userIDs: [{ name: "jake", email: "nellow1102@gmail.com" }] }); // returns armored value

  const readPubKey = await openpgp.readKey({ armoredKey: publicKey });
  const readPkKey = await openpgp.readPrivateKey({ armoredKey: privateKey });

  const message = await openpgp.createMessage({ text: superSecret, format: "text" });

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
