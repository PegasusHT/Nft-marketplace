import React, { Component } from "react";
import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'

import { Form, Button } from 'react-bootstrap';

import Web3Modal from 'web3modal'
import { useNavigate } from "react-router";

import { nftaddress, nftmarketaddress } from '../constants/constants'

import NFT from '../contracts/NFT.json'
import Market from '../contracts/NFTMarket.json'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const navigate = useNavigate();

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function createMarket(e) {
    console.log('in here')
    console.log(formInput)
    e.preventDefault();
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      console.log('done uploading ipfs')
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    console.log('done connecting to web3modal')
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()

    console.log('starting to create item')
    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()

    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    
    const price = ethers.utils.parseUnits(formInput.price, 'ether')

    console.log('done creating item')

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
    await transaction.wait()

    fetch('http://localhost:8000/api/create_nft/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'token_id': url,
        'author_alias': 'test'
      })
    }).then((response) => response.json())
    .then((json) => {
      console.log(json)
    })
    .catch((error) => {
      console.error(error);
    });

    console.log('done adding to marketplace')
    navigate('/')
  }

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formAssetName">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="NFT Name" onChange={e => updateFormInput({ ...formInput, name: e.target.value })} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formAssetDesc">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" rows={3} placeholder="Enter a description for your NFT" onChange={e => updateFormInput({ ...formInput, description: e.target.value })} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formAssetPrice">
        <Form.Label>Value</Form.Label>
        <Form.Control type="number" placeholder="Enter NFT value in ETH" onChange={e => updateFormInput({ ...formInput, price: e.target.value })} />
      </Form.Group>
      {
        fileUrl && (
          <img width="350" src={fileUrl} />
        )
      }
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Asset</Form.Label>
        <Form.Control type="file" onChange={(e) => onChange(e)}/>
      </Form.Group>
      <Button variant="primary" onClick={(e) => createMarket(e)}>
        Create NFT
      </Button>
    </Form>
  )
}