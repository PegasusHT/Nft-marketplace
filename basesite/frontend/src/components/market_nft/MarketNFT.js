import { Card, Button, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as lightHeart, faComment } from '@fortawesome/free-regular-svg-icons'
import { faHeart as solidHeart, faEthereum } from '@fortawesome/free-solid-svg-icons'
import Web3Modal from "web3modal"
import { ethers } from 'ethers'
import '../App.css'
import ethereumIcon from '../../images/eth-icon.webp'

import { useNavigate } from "react-router";

export default function MarketNFT(props) {
  const { nft, buy_action, favourite } = props;
  const [favIcon, setFavIcon] = useState(lightHeart);
  const [favClass, setFavClass] = useState("favourite-btn");
  const [nftFav, setNftFav] = useState(0);
  const [nftCom, setNftCom] = useState(0);
  const [isSeller, setIsSeller] = useState(false);
  const navigate = useNavigate();

  const nftHash = nft && nft.tokenUri.replace('https://ipfs.infura.io/ipfs/','');
  const nft_token_id = `https://ipfs.infura.io/ipfs/${nftHash}`



  async function favouriteNft(e, nft) {
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) {
      e.stopPropagation();
    } 

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const wallet_address = connection.selectedAddress

    if (favIcon === lightHeart) {
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
          'token_id': nft_token_id,
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
          'token_id': nft_token_id,
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

  useEffect(async () => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const wallet_address = connection.selectedAddress


    if (nft.seller.toLowerCase() == wallet_address) {
      setIsSeller("true")    }

    // Fetches the favourites of the current wallet address/account
    fetch(`http://localhost:8000/api/get_wallet_favorites/?wallet_address=${wallet_address}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    }).then((response) => response.json())
      .then((result) => {
        // console.log('favourites', result);
        // setNftComment(result);
        result.forEach((favourite) => {
          if (favourite.token_id === nft_token_id) {
            setFavIcon(solidHeart);
            setFavClass("favourite-btn-clicked")
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });

    // Fetches the NFT details        <Card.Img className='ethereumIcon' src={ethereumIcon} style={{ height: '100%', width: '10%', objectFit: 'cover' }} />

    fetch('http://localhost:8000/api/nft_details/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'token_id': nft_token_id,
      })
    }).then((response) => response.json())
      .then((json) => {
        // console.log(json)
        setNftFav(json[1].fields.favorites);
        setNftCom(json[1].fields.nft_comments);
      })
      .catch((error) => {
        console.error(error);
      });
  },[]);

  //need to use this function on onClick because sold item will not be able to view in detail
  function onclickNavigate() {
      if (nft.sold == false) {
        navigate(`/nft/${nftHash}`)
      }
      else {
        alert('This NFT has been sold. Unable to view this NFT in detail');
      }
  }
  
  return (
    <Col className='col-nft-container'>
      <Card className='Item-btn' style={{ width: '18rem' }} onClick={() => onclickNavigate()}>
        <Card.Img variant="top" src={nft.image} style={{ height: '100%', width: '100%', paddingTop: '1rem', objectFit: 'cover' }} />
        <Card.Body>
          <Card.Title>{nft.name}</Card.Title>
          <Card.Text>
            <img className='ethereum-icon' src={ethereumIcon} title='Price' alt=""/>
            <span className="nft-price">{nft.price}</span>
            <br/>
            {nft.description}
          </Card.Text>
          <div className="d-grid gap-2">
            { !isSeller && <Button variant="primary" onClick={() => buy_action(nft)}>Buy NFT</Button>}
          <div className='favourite-div'>
            <FontAwesomeIcon className='comment-icon' icon={faComment} title="Comment"/>
            <span className='num-comment'>{nftCom}</span>
            <span className='num-favourite'>{nftFav}</span>
            <FontAwesomeIcon className={favClass} icon={favIcon} onClick={(e) => favouriteNft(e, nft)} title="Favourite"/>
          </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}
