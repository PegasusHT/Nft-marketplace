# Information

This is the frontend portion of the NFT Marketplace. The frontend is handled by React and is responsible for the view.

# Development

To run the frontend application for development purposes, perform the following steps:

1. Run `npm install` to install all the necessary modules

2. Run `npm start` to start the server

# Folder Structure

The folder structure of the frontend application is as follows:

The `layouts` folder contains the general layout for a specific page. This includes the home page, and profile page.

The `components` folder contains the reusable components that is shared across the layouts.

The `constants` folder contains constants such as the API url and nft addresses.

# Todo

1. Create a script whenever a new version of the smart contract is compiled, to copy over the (abi) .json files to src/contracts/ for use within application