// Packages
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

// Constants
import { nftaddress, nftmarketaddress } from '../../constants/constants'

// Contracts
import NFT from '../../contracts/NFT.json'
import Market from '../../contracts/NFTMarket.json'

// Components
import MarketNFT from '../../components/market_nft/MarketNFT';

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setIsLoading(false);
  }

  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }

  return (
    <Container>
      <Button onClick={() => navigate('/create')}>Create NFT</Button> <br/>
        <Button onClick={() => navigate('/myasset')}>My Asset</Button>
        { !nfts.length && !isLoading && <h1>Empty Marketplace</h1> }
      { nfts.map((nft) => <MarketNFT nft={nft} buy_action={buyNft} /> )}
    </Container>
  )
}