exports.getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

exports.logger = (message) => {
  const timestamp = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
  console.log(`${timestamp} - ${message}`);
};
