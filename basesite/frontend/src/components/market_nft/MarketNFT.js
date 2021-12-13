// Packages
import { Card, Button, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as lightHeart, faComment } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import Web3Modal from "web3modal";
import { useNavigate } from "react-router";

// Styles and Assets
import "../App.css";
import ethereumIcon from "../../images/eth-icon.webp";

export default function MarketNFT(props) {
  const { nft, buy_action, isDashboard, isPurchased } = props;
  const navigate = useNavigate();

  const [favIcon, setFavIcon] = useState(lightHeart);
  const [favClass, setFavClass] = useState("favourite-btn");
  const [nftFav, setNftFav] = useState(0);
  const [nftCom, setNftCom] = useState(0);
  const [isSeller, setIsSeller] = useState(false);

  const nftHash = nft && nft.tokenUri.replace("https://ipfs.infura.io/ipfs/", "");
  const nft_token_id = `https://ipfs.infura.io/ipfs/${nftHash}`;

  async function favouriteNft(e, nft) {
    if (!e) var e = window.event;
    e.cancelBubble = true;

    if (e.stopPropagation) e.stopPropagation();

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const wallet_address = connection.selectedAddress;

    if (favIcon === lightHeart) {
      setFavIcon(solidHeart);
      setFavClass("favourite-btn-clicked");
      setNftFav(nftFav + 1);

      fetch("http://localhost:8000/api/favorite_nft/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "token_id": nft_token_id,
          "wallet_address": wallet_address,
          "is_followed": "True"
        })
      }).then((response) => response.json())
        .then((json) => {
          // Here in case we want to do something after we favourite the NFT
          // console.log(json);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setFavIcon(lightHeart);
      setFavClass("favourite-btn");
      setNftFav(nftFav - 1);

      fetch("http://localhost:8000/api/favorite_nft/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "token_id": nft_token_id,
          "wallet_address": wallet_address,
          "is_followed": "False"
        })
      }).then((response) => response.json())
        .then((json) => {
          // Here in case we want to do something after we unfavourite the NFT
          // console.log(json);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  useEffect(() => {
    async function getNFTInfo() {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const wallet_address = connection.selectedAddress;

      if (nft.seller.toLowerCase() === wallet_address) setIsSeller("true");

      // Fetches the favourites of the current wallet address/account
      fetch(`http://localhost:8000/api/get_wallet_favorites/?wallet_address=${wallet_address}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
      }).then((response) => response.json())
        .then((result) => {
          result.forEach((favourite) => {
            if (favourite.token_id === nft_token_id) {
              setFavIcon(solidHeart);
              setFavClass("favourite-btn-clicked");
            }
          });
        })
        .catch((error) => {
          console.error(error);
        });

      // Fetches the NFT details
      fetch("http://localhost:8000/api/nft_details/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "token_id": nft_token_id,
        })
      }).then((response) => response.json())
        .then((json) => {
          setNftFav(json[1].fields.favorites);
          setNftCom(json[1].fields.nft_comments);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    getNFTInfo();
  }, []);

  // Need to use this function on onClick because sold item will not be able to view in detail
  function onclickNavigate() {
    if (!nft.sold) {
      navigate(`/nft/${nftHash}`);
    } else if (!isPurchased) {
      alert("This NFT has been sold. Unable to view this NFT in detail");
    }
  }

  return (
    <Col>
      <Card className={`h-100 ${(!isDashboard && !isPurchased) ? 'Item-btn' : ''}`} style={{ width: "18rem" }} onClick={() => onclickNavigate()}>
        <Card.Img variant="top" src={nft.image} style={{ height: "100%", width: "100%", paddingTop: "1rem", paddingBottom: "1rem", objectFit: "cover" }} />
        <Card.Body>
          <Card.Title>{nft.name}</Card.Title>
          <Card.Text>
            <img className="ethereum-icon" src={ethereumIcon} title="Price" alt="" />
            <span className="nft-price">{nft.price}</span>
            <br />
            {nft.description}
          </Card.Text>
          {(!isDashboard && !isPurchased) && 
            <div className="d-grid gap-2">
              {isSeller
                ? <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">NFT was created by you</Tooltip>}>
                    <div>
                      <Button className="w-100"variant="secondary" disabled>Buy NFT</Button> 
                    </div>
                  </OverlayTrigger>
                : <Button variant="primary" onClick={() => buy_action(nft)}>Buy NFT</Button>}
              <div className="favourite-div">
                <FontAwesomeIcon className="comment-icon" icon={faComment} title="Comment" />
                <span className="num-comment">{nftCom}</span>
                <span className="num-favourite">{nftFav}</span>
                <FontAwesomeIcon className={favClass} icon={favIcon} onClick={(e) => favouriteNft(e, nft)} title="Favourite" />
              </div>
            </div>
          }
        </Card.Body>
      </Card>
    </Col>
  );
}
