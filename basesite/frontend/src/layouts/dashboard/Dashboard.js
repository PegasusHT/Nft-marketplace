// Packages
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { Container, Row } from "react-bootstrap";

// Constants
import { nftaddress, nftmarketaddress } from "../../constants/constants";

// Contracts
import NFT from "../../contracts/NFT.json";
import Market from "../../contracts/NFTMarket.json";

// Components
import MarketNFT from "../../components/market_nft/MarketNFT";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [soldNFTs, setSoldNFTs] = useState([]);

  useEffect(() => {
    loadNFTs();
  }, [])

  async function loadNFTs() {
    // Query for created NFTs
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const data = await marketContract.fetchItemsCreated();

    const items = await Promise.all(data.map(async (i) => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(), "ether");

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

    const soldItems = items.filter(item => item.sold);

    setNfts(items);
    setSoldNFTs(soldItems);
    setIsLoading(false);
  }

  return (
    <Container>
      <h1>Creator Dashboard</h1>
      {!nfts.length && !isLoading && (
        <div>
          <Container className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
            <h3 className="text-muted">Create a NFT to see creator dashboard information!</h3>
          </Container>
        </div>
      )}
      <Container className="py-3">
        {nfts.length > 0 && <h3>Items Created</h3>}
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {nfts.map((nft) => <MarketNFT nft={nft} isDashboard />)}
        </Row>
      </Container>
      <Container className="pt-3">
        {nfts.length > 0 && <h3>Items Sold</h3>}
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {soldNFTs.map((nft) => <MarketNFT nft={nft} isDashboard />)}
        </Row>
      </Container>
    </Container>
  );
}