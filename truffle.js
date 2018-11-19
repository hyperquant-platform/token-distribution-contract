require('babel-register')({
  ignore: /node_modules\/(?!zeppelin-solidity)/
});
require('babel-polyfill');

var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    ropsten: {
      provider: function() {
        return new HDWalletProvider(process.env.RopstenMnemonic, process.env.RopstenInfuraUrl);
      },
      network_id: '3',
    },
  }
};