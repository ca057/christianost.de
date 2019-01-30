const fs = require('fs').promises;

const writeToFile = async (path, data, options = {}) => {
  let fileHandle;
  try {
    fileHandle = await fs.open(path, 'w');
    fileHandle.writeFile(data, options);
  } finally {
    if (fileHandle !== undefined) await fileHandle.close();
  }
};

module.exports = { writeToFile };
