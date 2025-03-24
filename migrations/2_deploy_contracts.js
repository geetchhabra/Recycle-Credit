const RecycToken = artifacts.require("RecycToken");

module.exports = function (deployer) {
  deployer.deploy(RecycToken);
};
