const openpgp = require("openpgp");

const secret = "my cool message";

(async () => {
  const { privateKey, publicKey } = await openpgp.generateKey({ curve: "curve25519", userIDs: [{ name: "jake", email: "nellow1102@gmail.com" }] }); // returns armored value

  const readPubKey = await openpgp.readKey({ armoredKey: publicKey });
  const readPkKey = await openpgp.readPrivateKey({ armoredKey: privateKey });

  const message = await openpgp.createMessage({ text: secret, format: "text" });

  const encrypted = await openpgp.encrypt({
    message,
    encryptionKeys: readPubKey,
  });

  const target = await openpgp.readMessage({
    armoredMessage: encrypted,
  });

  const { data, signatures } = await openpgp.decrypt({
    message: target,
    decryptionKeys: readPkKey,
  });

  console.log({ data, signatures });
})();
