// const camelcaseKeys = require("camelcase-keys");
const camelcaseKeys = import("camelcase-keys");

const zeroPad = (num, places) => String(num).padStart(places, "0");

// const { getDate } = require("./time");
const { ErrorHandler } = require("../helper");

module.exports = {
  camelize: (obj) => {
    try {
      return JSON.parse(JSON.stringify(obj))
    } catch (error) {
      throw error;
    }
  },
};
// module.exports = {
//   camelize: async (obj) => {
//     try {
//       const camelcaseKeys = await import("camelcase-keys");
//       return camelcaseKeys.default(obj, { deep: true });
//     } catch (error) {
//       throw error;
//     }
//   },
// };

