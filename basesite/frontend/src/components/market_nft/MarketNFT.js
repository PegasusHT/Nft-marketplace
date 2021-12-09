import { Card, Button } from 'react-bootstrap';
import '../App.css'
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as lightHeart } from '@fortawesome/free-regular-svg-icons'
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons'


import Web3Modal from "web3modal"
import { ethers } from 'ethers'

export default function MarketNFT(props) {
  const { nft, buy_action } = props;
  const [favIcon, setFavIcon] = useState(lightHeart);
  const [favClass, setFavClass] = useState("favourite-btn");
  const [nftFav, setNftFav] = useState(0);

  async function favouriteNft(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const wallet_address = connection.selectedAddress
    console.log(nft.contractAddress)


    if (favIcon == lightHeart) {
      setFavIcon(solidHeart)
      setFavClass("favourite-btn-clicked")
      setNftFav(nftFav +1);

      fetch('http://localhost:8000/api/favorite_nft/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'token_id': nft.tokenId,
          'wallet_address': wallet_address,
          'is_followed': "True"
        })
      }).then((response) => response.json())
        .then((json) => {
          console.log(json);
        })
        .catch((error) => {
          console.error(error);
        });
      
    }
    else {
      setFavIcon(lightHeart)
      setFavClass("favourite-btn")
      setNftFav(nftFav -1);

      fetch('http://localhost:8000/api/favorite_nft/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'token_id': nft.tokenId,
          'wallet_address': wallet_address,
          'is_followed': "False"
        })
      }).then((response) => response.json())
        .then((json) => {
          console.log(json);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  useEffect(() => {
    fetch('http://localhost:8000/api/nftmetadata_view/' + '?token_id=' + nft.tokenId, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    }).then((response) => response.json())
      .then((json) => {
        setNftFav(json['favorites']);
      })
      .catch((error) => {
        console.error(error);
      });
  },[]);

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={nft.image} style={{ height: '100%', width: '100%', paddingTop: '1rem', objectFit: 'cover' }} />
      <Card.Body>
        <Card.Title>{nft.name}</Card.Title>
        <Card.Text>
          {nft.description}
        </Card.Text>

        <div className="d-grid gap-2">
          <Button variant="primary" onClick={() => buy_action(nft)}>Buy NFT</Button>
        </div>
        <div className='favourite-div'>
          <span className='num-favourite'>{nftFav}</span>
          <FontAwesomeIcon className={favClass} icon={favIcon} onClick={() => favouriteNft(nft)} title="Favourite"/>
        </div>
      </Card.Body>
    </Card>
  );
}