# NFT Marketplace

## Overall Structure
There are many components to the application. Each section will contain its own README for information regarding the use of the tool.

| Structure       | Tool        | Description
| -----------     | ----------- | -----------
| Frontend        | React       | React will be responsible for handling the view, and enable the use of Metamask to handle transactions
| Backened        | Django      | Django will be used to handle API calls
| Smart Contract  | Hardhat     | Hardhat will be used to create, compile, and deploy the smart contracts

## Running with Docker
1. Inside the <code>basesite</code> directory bring the containers up:
```shell
docker-compose down && docker system prune -f
docker-compose build && docker-compose up
```
This step deploys the smart contracts on the local blockchain.
We can verify this in the Docker logs:
```
blockchain_1  |   Contract deployment: <UnrecognizedContract>
blockchain_1  |   Contract address:    0x5fbdb2315678afecb367f032d93f642f64180aa3
blockchain_1  |   Transaction:         0x536478ef2f99b34254dccc9cc69186c1f3aa0bada106d6d4508665a35df8e39f
blockchain_1  |   From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
blockchain_1  |   Value:               0 ETH
blockchain_1  |   Gas used:            1457965 of 1457965
blockchain_1  |   Block #1:            0xe1c84e9eab2514d92505aa2e3ffdd986d75249cb4d41301b4469caec3c675767
blockchain_1  |
blockchain_1  | eth_chainId
blockchain_1  | eth_getTransactionByHash
blockchain_1  | eth_chainId
blockchain_1  | eth_getTransactionReceipt
app_1         | nftMarket deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
blockchain_1  | eth_accounts
blockchain_1  | eth_chainId
blockchain_1  | eth_estimateGas
blockchain_1  | eth_gasPrice
blockchain_1  | eth_sendTransaction
blockchain_1  |   Contract deployment: <UnrecognizedContract>
blockchain_1  |   Contract address:    0xe7f1725e7734ce288f8367e1bb143e90bb3f0512
blockchain_1  |   Transaction:         0xccd88ac29dde47a2f54a905e7b07a782f1f2fd98b4406a4c88eb416176390632
blockchain_1  |   From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
blockchain_1  |   Value:               0 ETH
blockchain_1  |   Gas used:            2519355 of 2519355
blockchain_1  |   Block #2:            0x88943b510c56a9c6ff3cc6834de88dbf20a4a439b0cc18433c96f47951a35962
```
This step also brings up the backend server and database as well.

2. <b>Important</b>: Once our blockchain in finished setting up and our system is up we now need to connect our Metamask Wallet to the local blockchain <br>
According to the hardhat docs: <https://hardhat.org/metamask-issue.html>
> MetaMask mistakenly assumes all networks in http://localhost:8545 to have a chain id of 1337, but Hardhat uses a different number by default

<b>To fix this, you will configure the correct chainId of metamask Localhost 8545 network: </b> <br>
1. Open metamask and click on you account (top right circle icon)
2. Scroll down to settings -> then scroll down to networks 
3. Click "Add Network"
4. Configure the Network as follows:
![metamask_settings](/images/metamask_settings.png)

5. Now, navigate to <http://localhost:8080/> and <http://localhost:8080/create>
for the NFT marketplace and NFT creation views respectively

# Features
#### Initially when we go to <http://localhost:8080/> we expect there to be no NFTs
![no_nft_marketplace](/images/no_nft_marketplace.png)

#### Then we can go to <http://localhost:8080/create> to make an NFT. Observe that it costs 0.025 Ether in Gas for this transaction
![create_nft](/images/create_nft.png)

#### After the transaction is complete, go back to <http://localhost:8080/> to see our created NFT
![nft_marketplace](/images/nft_marketplace.png)

#### We can also buy an NFT with the buy button, go back to <http://localhost:8080/> to see NFTs to buy
![buy_nft](/images/buy_nft.png)

#### In our Docker logs, we can verify that the NFT creation (0.025 ETH) and Buy NFT (100 ETH) transactions are successful:
```
blockchain_1  | eth_sendRawTransaction
blockchain_1  |   Contract call:       <UnrecognizedContract>
blockchain_1  |   Transaction:         0xd6487d90c88242d5b04d28a3b0e100e720f31646d5428ba39e3e8115b6796e83
blockchain_1  |   From:                0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199
blockchain_1  |   To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3
blockchain_1  |   Value:               0.025 ETH
blockchain_1  |   Gas used:            189805 of 210564
blockchain_1  |   Block #4:            0x38ceab746d4b27df962a302ed5ddeba5d6625cbf13643305fab5efed4924d515
blockchain_1  |
blockchain_1  | eth_getTransactionReceipt
eth_blockNumber (2)_blockNumber
blockchain_1  | eth_getBlockByHash
blockchain_1  | eth_blockNumber
app_1         | [pid: 69|app: 0|req: 2/5] 172.18.0.5 () {52 vars in 1251 bytes} [Thu Nov 25 03:29:08 2021] GET / => generated 629 bytes in 2 msecs (HTTP/1.0 200) 5 headers in 166 bytes (1 switches on core 0)
web_1         | 172.18.0.1 - - [25/Nov/2021:03:29:08 +0000] "GET / HTTP/1.1" 200 629 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36" "-"
eth_chainId (2) eth_chainId
blockchain_1  | eth_call
blockchain_1  |   Contract call:       <UnrecognizedContract>
blockchain_1  |   From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
blockchain_1  |   To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3
blockchain_1  |
blockchain_1  | eth_chainId
blockchain_1  | eth_call
blockchain_1  |   Contract call:       <UnrecognizedContract>
blockchain_1  |   From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
blockchain_1  |   To:                  0xe7f1725e7734ce288f8367e1bb143e90bb3f0512
blockchain_1  |
blockchain_1  | eth_estimateGas
blockchain_1  | eth_getCode
blockchain_1  | eth_gasPrice
blockchain_1  | eth_blockNumber
eth_getBalance (11)_getBalance
blockchain_1  | eth_blockNumber
blockchain_1  | eth_getTransactionCount
blockchain_1  | eth_sendRawTransaction
blockchain_1  |   Contract call:       <UnrecognizedContract>
blockchain_1  |   Transaction:         0xfad70bd7c2e7fb7d14418278e9939313f9e1b0e6576b9ffb0358794b1aadd0d6
blockchain_1  |   From:                0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199
blockchain_1  |   To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3
blockchain_1  |   Value:               100 ETH
blockchain_1  |   Gas used:            137852 of 158852
blockchain_1  |   Block #5:            0x003db1aaf9de5f0490236c9663e588de2ff2c6fc2fde426026e58108a2f8f035
blockchain_1  |
```

# Troubleshooting
Sometimes, after the blockchain container is stopped and is brought back up, 
the transactions between the Metamask Wallet and the local blockchain can be out of sync.

In reality, the Ethereum blockchain is decentralized and always running on multiple nodes so this shouldn't happen in practice.
However, when working with a single local blockchain node in a Docker container, there can be synchronization issues like the following:
```
Nonce too high. Expected nonce to be 0 but got 4. Note that transactions can't be queued when automining.
```
In this case, the work-around is to reset the account:
1. Open metamask and click on you account (top right circle icon)
2. Scroll down to settings -> then scroll down to advanced
3. Scroll down to Reset account
![reset_account](/images/reset_account.jpeg)
<br> This should resynchronize the transactions between the Metamask Wallet and the local blockchain

---
## Running Local Development without Docker
The following steps have to be performed in order to get set up with development:

### Installing Dependencies
In the `frontend` and `smart_contract` directories, download and install the dependencies required
```shell
cd basesite/frontend/
npm install

cd basesite/smart_contract/
npm install
```

### Running Django Server
In the `basesite` directory, start the Django server
```shell
cd basesite/
python3 manage.py runserver
```

### Running the Local Ethereum Test Network
In a new terminal, start up a local instance of the Ethereum Network
```shell
cd basesite/smart_contract/
npx hardhat node
```

### Deploy Smart Contracts
In another terminal, deploy the smart contracts to the local network
```shell
cd basesite/smart_contract/
npx hardhat run scripts/deploy.js --network localhost
```

**Note**: Make sure to double check the addresses of the two smart contracts and compare them with `constants.js` found in the `frontend` directory. Also, make sure to copy over `NFT.json` and `NFTMarket.json` files in `basesite/smart_contract/artifacts/contracts/` to `basesite/frontend/src/contracts/`

### Run React Application
In yet another terminal, start up the React application
```shell
cd basesite/frontend/
npm start
```