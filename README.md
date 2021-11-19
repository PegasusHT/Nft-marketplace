#Overall structure
django as backend - folder: basesite, api
react as frontend - folder: frontend
hardhat as smart contract development environment - folder:
    - artifacts: this folder is generate when you compile smart contract or run test. It contains all the information that is necessary to deploy and interact with the contract.
    - contract: write smart contract in here.
    - scripts: contains deploy.js, where you deploy smart contracts.
    - test: write tests for smart contracts here.
    - harhad.config.js
    - more informations: https://hardhat.org/

#How does smart contract and frontend interact:
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

#How to run everything
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
