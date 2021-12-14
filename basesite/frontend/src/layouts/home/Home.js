// Constants
import { nftaddress, nftmarketaddress } from "../../constants/constants";

// Contracts
import NFT from "../../contracts/NFT.json";
import Market from "../../contracts/NFTMarket.json";

// Components
import MarketNFT from "../../components/market_nft/MarketNFT";

// Packages
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { Container, Row } from "react-bootstrap";

// Default page when loading localhost:8080
export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNFTs()
  }, []);

  async function loadNFTs() {
    // Query for market NFTs
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
    const data = await marketContract.fetchMarketItems();

    // Map over items returned from smart contract and obtain metadata
    const items = await Promise.all(data.map(async (i) => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri);
      const price = ethers.utils.formatUnits(i.price.toString(), "ether");

      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        tokenUri: tokenUri,
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }

      return item;
    }));

    // Once the market items are fetched and parsed, set them and set loading to false
    setNfts(items);
    setIsLoading(false);
  }

  async function buyNft(e, nft) {
    if (!e) var e = window.event;
    e.cancelBubble = true;

    if (e.stopPropagation) e.stopPropagation();
    
    // Allows for method to let user to sign the transaction
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    // Prompts user to pay associated fees
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, { value: price });

    await transaction.wait();
    loadNFTs();
  }

  return (
    <Container>
      <h1>Marketplace</h1>
      {!nfts.length && !isLoading && (
        <div>
          <Container className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
            <h3 className="text-muted">Create a NFT to get started!</h3>
          </Container>
        </div>
      )}
      <Container>
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {nfts.map((nft) => <MarketNFT nft={nft} buy_action={buyNft} />)}
        </Row>
      </Container>
    </Container>
  );
}