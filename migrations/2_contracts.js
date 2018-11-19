var TokenDistribution = artifacts.require("./TokenDistribution.sol");

module.exports = function(deployer) {
  deployer.deploy(TokenDistribution);
}
