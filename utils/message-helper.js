const crypto = require("crypto");

module.exports = {
  encryptedPassword: (password) => {
    try {
      const shasum = crypto.createHash("sha1");
      const data = shasum.update(password);

      const enc = data.digest("hex");

      return enc;
    } catch (error) {
      console.error(error);
      return 0;
    }
  },
  hashGenerator: async (USERNAME, SENDERID, messgae, KEY) => {
    try {
      const hash = crypto.createHash("sha512");
      const data = hash.update(`${USERNAME}${SENDERID}${messgae}${KEY}`);
      const gen_hash = data.digest("hex");
      console.log("hash : " + gen_hash);

      return gen_hash;
    } catch (error) {
      console.error(error);
      return 0;
    }
  },
};
