# NFT Marketplace Smart Contract Deployment using Hardhat
NFT Marketplace uses the **Hardhat Ethereum Development Environment** to create, compile, and deploy our smart contracts. We also use Hardhat to create a local Ethereum network to test our smart contract deployment **without requiring the use of actual currency**.

## Development
To get set up for development with Hardhat, ensure that you have the latest version of `node` and `npm`. Then, perform the following steps:

*Note: Ensure that you are in the correct directory when running any of the commands below, otherwise, it will not work.*

### Installing Dependencies
To install the dependencies needed, open a new terminal window in this directory and run `npm install`

### Run JSON-RPC server
To run the local Ethereum network, run `npx hardhat node`

### Smart Contract Compilation and Deployment
To compile the smart contracts, run `npx hardhat compile`

To deploy the smart contract to the local network, run `npx hardhat run scripts/deploy.js --network localhost`

