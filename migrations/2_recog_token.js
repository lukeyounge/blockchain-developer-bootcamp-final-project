const RecogToken = artifacts.require("RecogToken");

module.exports = function (deployer) {
  deployer.deploy(RecogToken);
};