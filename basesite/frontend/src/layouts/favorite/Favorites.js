// Packages
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import axios from "axios"
import Web3Modal from "web3modal"
import { Container, Row} from "react-bootstrap";

// Constants
import { nftaddress, nftmarketaddress } from "../../constants/constants"

// Contracts
import NFT from "../../contracts/NFT.json"
import Market from "../../contracts/NFTMarket.json"

// Components
import MarketNFT from "../../components/market_nft/MarketNFT";

export default function Favorites() {
  const [isLoading, setIsLoading] = useState(true);
  const [favNFT, setFavNFT ] = useState([]);

  useEffect(() => {
    loadFavoriteNFTs();
  }, []);

  async function loadFavoriteNFTs() {
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

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const wallet_address = connection.selectedAddress;

    // Fetches the favourites of the current wallet address/account
    fetch(`http://localhost:8000/api/get_wallet_favorites/?wallet_address=${wallet_address}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
    }).then((response) => response.json())
      .then((result) => {
        const new_result = result.map(nft => nft.token_id);
        const favorite_items = items.filter((item) => new_result.includes(item.tokenUri));
        setFavNFT(favorite_items);
      })
      .catch((error) => {
        console.error(error);
      });

    setIsLoading(false);
  }

  async function buyNft(nft) {
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
    loadFavoriteNFTs();
  }

  return (
    <Container>
      <h1>Favourites</h1>
      {!favNFT.length && !isLoading && (
        <div>
          <Container className="d-flex flex-column justify-content-center align-items-center" style={{ height: "80vh" }}>
            <h3 className="text-muted">No Favourites</h3>
            <br />
            <h5 className="text-muted">Favourite a NFT to see it in this page!</h5>
          </Container>
        </div>
      )}
      <Container>
      <Row xs={1} md={2} lg={3} xl={4} className="g-4">
        { favNFT.map((nft) => <MarketNFT nft={nft} buy_action={buyNft}/> )}
        </Row>
      </Container>
    </Container>
  )
}