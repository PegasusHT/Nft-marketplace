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

## My approach to running the system in Docker: (Frontend / React not working)
1. Inside the <code>basesite</code> directory bring the containers up:
```shell
docker-compose down && docker system prune -f
docker-compose build && docker-compose up
```
2. Open another terminal and bring up the blockchain in hardhat:
```shell
docker-compose exec app bash # NOTE: now you are in the docker container file system
cd basesite/
npx hardhat run scripts/deploy.js --network localhost
```
This will open a local network for smart contracts.
3. Open another terminal: 
```shell
docker-compose exec app bash # NOTE: now you are in the docker container file system
cd cd frontend/
npx hardhat run scripts/deploy.js --network localhost
```
<b>Make sure you have the same addresses as in config.js file. Sometimes it will change.</b>
4.  Still inside the docker container:
```shell
cd frontend/
npm run dev #
```
Console Output:
```
> frontend@1.0.0 dev
> webpack --mode development --watch
asset main.js 3.4 MiB [compared for emit] [minimized] (name: main) 1 related asset
orphan modules 228 KiB [orphan] 52 modules
runtime modules 1.28 KiB 7 modules
modules by path ../node_modules/ 2.84 MiB 415 modules
modules by path ../../../node_modules/ 124 KiB
  modules by path ../../../node_modules/react/ 70.6 KiB 2 modules
modules by path ./ 8.14 KiB
  modules by path ./src/components/*.js 7.96 KiB 4 modules
  ./src/index.js 35 bytes [built] [code generated]
  ./config.js 149 bytes [built] [code generated]
modules by path ../artifacts/contracts/ 77 KiB
  ../artifacts/contracts/NFT.sol/NFT.json 49.1 KiB [built] [code generated]
  ../artifacts/contracts/NFTMarket.sol/NFTMarket.json 27.9 KiB [built] [code generated]
5 modules
webpack 5.64.2 compiled successfully in 7461 ms
```
5. <b> However, the metamask is still not connected. I think Somehow react is not connected after:</b> <code> npm run dev </code>


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
