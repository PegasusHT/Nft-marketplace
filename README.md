# Overall structure
django as backend - folder: basesite, api  
react as frontend - folder: frontend  
hardhat as smart contract development environment - folder:  
    - artifacts: this folder is generate when you compile smart contract or run test. It contains all the information that is necessary to deploy and interact with the contract.  
    - contract: write smart contract in here.  
    - scripts: contains deploy.js, where you deploy smart contracts.  
    - test: write tests for smart contracts here.  
    - harhad.config.js  
    - more informations: https://hardhat.org/  


# How does smart contract and frontend interact:  
1. Write smart contract, and compile them or run test to generate artifacts (we need to get smart contracts' abi from artifacts folder)
```shell
npx hardhat compile
or 
npx hardhat test
```
2. Run deploy.scripts 
```shell
npx hardhat run scripts/deploy.js --network localhost
```
3. The above command will generates 2 smart contracts address, nft and nftmarket. To call smart contracts' function in front end, we need to have their address and abi (in artifacts folder). Save these 2 addresses in a config.js inside frontend folder.
4. Import those into React components (see code examples, frontend/src/components/..) and use them.

## How to run in Docker:  
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
to use the NFT marketplace

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

# How to run everything
1. In basesite:
```shell
python3 manage.py runserver
```
2. Open another terminal:
```shell
npx hardhat node
```
This will open a local network for smart contracts.
3. Open another terminal run: 
```shell
npx hardhat run scripts/deploy.js --network localhost
```
Make sure you have the same addresses as in config.js file. Sometimes it will change.  
4. cd into frontend and run:
```shell
npm run dev
```
