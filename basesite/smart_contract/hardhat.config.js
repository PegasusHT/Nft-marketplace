/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-ganache")

// const fs = require("fs")
// const privateKey = fs.readFileSync(".secret").toString()
const projectId = "this is infura id"


// const fs = require('fs')
// const privateKey = fs.readFileSync(".secret").toString().trim() || "01234567890123456789"

module.exports = {
  // defaultNetwork: "hardhat",
  networks: {
    localhost_docker: {
      url: "http://blockchain:8545"
    },
    localhost: {
      url: "http://localhost:8545"
    }
    // mumbai: {
    //   url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
    //   accounts: [privateKey]
    // },
    // mainnet: {
    //   url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
    //   accounts: [privateKey]
    // }
  },
  solidity: {
    version: "0.8.4",
    // settings: {
    //   optimizer: {
    //     enabled: true,
    //     runs: 200
    //   }
    // }
  }
}
