// Packages
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { Card, CardGroup, Container } from "react-bootstrap";

// Constants
import { nftaddress, nftmarketaddress } from "../constants/constants";

// Contracts
import NFT from "../contracts/NFT.json";
import Market from "../contracts/NFTMarket.json";

export default function TransactionsHistory() {
  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [bought, setBought] = useState([]);

  const [loadingState, setLoadingState] = useState("not-loaded")

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
    const data = await marketContract.fetchItemsCreated();
    const boughtData = await marketContract.fetchMyNFTs();

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), "ether")
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
      }

      return item;
    }))

    const boughtItemsData = await Promise.all(boughtData.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), "ether")
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
      }

      return item;
    }))

    const soldItems = items.filter(i => i.sold);

    setSold(soldItems);
    setBought(boughtItemsData);
    setNfts(items);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded" && !Boolean(sold.length) && !Boolean(bought.length))
    return (<h1 style={{ marginLeft: "10%" }}>Empty history.</h1>)
  
  return (
    <Container>
      <h1>Sold items</h1>
      {!sold.length && loadingState === "loaded" && <h1>No assets sold.</h1>}
      <Container>
        {
          Boolean(sold.length) && (
            <Container>
              <CardGroup>
                {sold.map((nft, i) =>
                  <Card key={i} style={{ maxWidth: "18rem" }}>
                    <Card.Img variant="top" src={nft.image} style={{ height: "100%", width: "100%", paddingTop: "1rem", paddingBottom: "1rem", objectFit: "cover" }} />
                    <Card.Body style={{ height: "10rem" }} >
                      <Card.Title>{nft.name}</Card.Title>
                      <Card.Text style={{ marginBottom: "0.3rem" }}>
                        Description: {nft.description}
                      </Card.Text>
                      <Card.Text>
                        Sold Price: {nft.price} ETH
                      </Card.Text>
                    </Card.Body>
                  </Card>
                )}
              </CardGroup>
            </Container>
          )
        }
      </Container>

      <Container>
        <h1>Bought items</h1>
        {!bought.length && loadingState === "loaded" && <h1>No assets bought.</h1>}
        {
          Boolean(bought.length) && (
            <Container>
              <CardGroup>
                {bought.map((nft, i) =>
                  <Card key={i} style={{ maxWidth: "18rem" }}>
                    <Card.Img variant="top" src={nft.image} style={{ height: "100%", width: "100%", paddingTop: "1rem", paddingBottom: "1rem", objectFit: "cover" }} />
                    <Card.Body style={{ height: "10rem" }} >
                      <Card.Title>{nft.name}</Card.Title>
                      <Card.Text style={{ marginBottom: "0.3rem" }}>
                        Description: {nft.description}
                      </Card.Text>
                      <Card.Text>
                        Purchased Price: {nft.price} ETH
                      </Card.Text>
                    </Card.Body>
                  </Card>
                )}
              </CardGroup>
            </Container>
          )
        }
      </Container>
    </Container>
  )
}