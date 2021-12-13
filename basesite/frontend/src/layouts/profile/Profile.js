// Packages
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import axios from "axios"
import Web3Modal from "web3modal"
import { Container, Row } from "react-bootstrap";

// Constants
import { nftaddress, nftmarketaddress } from "../../constants/constants";

// Contracts
import NFT from "../../contracts/NFT.json";
import Market from "../../contracts/NFTMarket.json";

// Components
import MarketNFT from "../../components/market_nft/MarketNFT";

export default function Profile() {
  const [nfts, setNfts] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const data = await marketContract.fetchMyNFTs();

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

    // Once the purchased items are fetched and parsed, set them and set loading to false
    setNfts(items);
    setIsLoading(false);
  }

  return (
    <Container>
      <h1>Purchases</h1>
      {!nfts.length && !isLoading && (
        <div>
          <Container className="d-flex flex-column justify-content-center align-items-center" style={{ height: "80vh" }}>
            <h3 className="text-muted">No Purchases</h3>
            <br />
            <h5 className="text-muted">Purchase a NFT to see it in this page!</h5>
          </Container>
        </div>
      )}
      <Container>
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {nfts.map((nft) => <MarketNFT nft={nft} isPurchased />)}
        </Row>
      </Container>
    </Container>
  )
}