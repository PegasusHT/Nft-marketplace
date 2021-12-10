import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import { nftaddress, nftmarketaddress } from '../constants/constants'
import NFT from '../contracts/NFT.json'
import Market from '../contracts/NFTMarket.json'
import {Card, CardGroup, Container} from "react-bootstrap";

export default function CreatedItems() {
    const [nfts, setNfts] = useState([])
    const [sold, setSold] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
        loadNFTs()
    }, [])
    async function loadNFTs() {
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
        const data = await marketContract.fetchItemsCreated()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                sold: i.sold,
                image: meta.data.image,
            }
            return item
        }))
        /* create a filtered array of items that have been sold */
        const soldItems = items.filter(i => i.sold)
        setSold(soldItems)
        setNfts(items)
        setLoadingState('loaded')
    }
    if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets created</h1>)
    return (
        <Container>
            <Container>
                <h1>Created items</h1>
                {!nfts.length && loadingState ==='loaded' && <h1>No Assets</h1>}
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

            <Container>
                {
                    Boolean(sold.length) && (
                        <Container>
                            <h1>Sold items</h1>
                            <CardGroup>
                                {sold.map((nft, i) =>
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

            </Container>
        </Container>
    )
}