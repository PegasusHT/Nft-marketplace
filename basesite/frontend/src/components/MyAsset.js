import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import { Container, CardGroup } from 'react-bootstrap';
import { nftaddress, nftmarketaddress } from '../constants/constants'
import NFT from '../contracts/NFT.json'
import Market from '../contracts/NFTMarket.json'
import { Card } from "react-bootstrap";

export default function MyAsset() {
    const [nfts, setNfts] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadNFTs()
    }, [])

    async function loadNFTs() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
        const data = await marketContract.fetchMyNFTs()

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

    return (
        <Container>
            <h1>My Assets</h1>
            {!nfts.length && !isLoading && <h3>No Assets</h3>}
            <CardGroup>
                {nfts.map((nft, i) =>
                    <Card key={i} style={{ maxWidth: '18rem' }}>
                        <Card.Img variant="top" src={nft.image} style={{ height: '100%', width: '100%', paddingTop: '1rem', paddingBottom: '1rem', objectFit: 'cover' }} />
                        <Card.Body style={{ height: '10rem' }} >
                            <Card.Title>{nft.name}</Card.Title>
                            <Card.Text style={{ marginBottom: '0.3rem' }}>
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