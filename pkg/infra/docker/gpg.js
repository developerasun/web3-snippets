// brew install gnupg
const gpg = require("gpg");

gpg.encrypt("hello world");
gpg.encryptToFile("test.txt", "test2.txt");

// gpg.importKey(key, [], (success, err) => {
//     gpg.
// });
gpg.encryptFile("./test.txt", (f) => {
  console.log(f);
});

gpg.encrypt("eh", [], (success, err) => {});
