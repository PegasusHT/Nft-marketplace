import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import { useNavigate } from 'react-router-dom';

import { nftaddress, nftmarketaddress } from '../constants/constants'

import NFT from '../contracts/NFT.json'
import Market from '../contracts/NFTMarket.json'
import {Button, Card} from "react-bootstrap";


export default function MyAsset() {
    const navigate = useNavigate();
    const [nfts, setNfts] = useState([])
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
        setLoadingState('loaded')
    }
    if (loadingState === 'loaded' && !nfts.length) return (
        <div>
            <Button onClick={() => navigate('/')}>Home</Button> <br/>
            <h1 className="py-10 px-20 text-3xl">No assets owned</h1>
        </div>
    )

    return (
    <div className="flex justify-center">
        <Button onClick={() => navigate('/')}>Home</Button> <br/>
        <div className="p-4">
            <p><b>My assets</b></p>
            <div>
                {
                    nfts.map((nft, i) => (
                        <Card key={i} style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={nft.image} />
                            <Card.Body>
                                <Card.Title>{nft.name}</Card.Title>
                                <Card.Text>
                                    <p>Description: {nft.description}</p>
                                </Card.Text>
                                <Card.Text>
                                    <p>Purchased price: {nft.price} Eth</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))
                }
            </div>
        </div>
    </div>
    )
}