// Packages
import { ethers } from 'ethers'
import Web3Modal from "web3modal"
import axios from 'axios';
import '../../components/App.css'
import React, { useEffect, useState, useRef } from 'react'
import { Container, Card, Row, Col, Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as lightHeart, faEye } from '@fortawesome/free-regular-svg-icons'
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons'
import Comment from '../../components/comment/Comments'
// Constants
import { nftaddress, nftmarketaddress } from '../../constants/constants'

// Contracts
import NFT from '../../contracts/NFT.json'
import Market from '../../contracts/NFTMarket.json'

export default function Details() {
  const { id } = useParams();
  const [nft, setNft] = useState(undefined);
  const [nftDetails, setNftDetails] = useState({});
  const [nftMetadata, setNftMetadata] = useState({});
  const [nftComment, setNftComment] = useState([]);
  const [update, setUpdate] = useState(true);

  const [validated, setValidated] = useState(false);
  const formRef = useRef(null);
  const nft_token_id = `https://ipfs.infura.io/ipfs/${id}`
  const [formInput, updateFormInput] = useState({ authorAlias: '', comment: '' })


  useEffect(() => {
    if (update) {
      // First, update the view count by 1, then
      // Grab the NFT details and metadata from the Django API server
      if (id) {
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
          .then((result) => {
            const nft_details = result && result.length > 0 && result[0].fields;
            const nft_metadata = result && result.length > 1 && result[1].fields;

            setNftDetails(nft_details);
            setNftMetadata(nft_metadata);
            // console.log(nft_metadata);
          })
          .catch((error) => {
            console.error(error);
          });
      }

      fetch(`http://localhost:8000/api/get_comments/?token_id=${nft_token_id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      }).then((response) => response.json())
        .then((result) => {
          // console.log(result);
          setNftComment(result);
        })
        .catch((error) => {
          console.error(error);
        });

      loadNFTs();
      setUpdate(false);
      // updateFormInput({ authorAlias: '', comment: ''});
    }
  }, [id, update]);

  async function loadNFTs() {
    // Get the current market NFTs
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
    const data = await marketContract.fetchMarketItems();

    // Fetch and format the marketplace NFTs to an object with its attributes
    const nfts = await Promise.all(data.map(async (i) => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri);
      const price = ethers.utils.formatUnits(i.price.toString(), 'ether');

      return {
        price,
        tokenId: i.tokenId.toNumber(),
        tokenUri: tokenUri,
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
    }));

    // This is used to compare against the Django NFT API token_id
    const tokenUri = 'https://ipfs.infura.io/ipfs/' + id;

    // Find the correct marketplace NFT given the token URI
    const nft = nfts.filter((nft) => nft.tokenUri === tokenUri);
    if (nft && nft.length > 0) setNft(nft[0]);
  }

  async function postComment(e) {
    e.preventDefault();
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const wallet_address = connection.selectedAddress

    const { authorAlias, comment } = formInput
    if (!comment || !authorAlias || !wallet_address || !nft_token_id) return;

    fetch('http://localhost:8000/api/post_comment/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'token_id': nft_token_id,
        'comment': comment,
        'author_alias': authorAlias,
        'author_address': wallet_address
      })
    }).then((response) => response.json())
      .then((json) => {
        console.log(json);
        setUpdate(true);

      })
      .catch((error) => {
        console.error(error);
      });

    // change callUpdate to update the page
    console.log("posted comment");
    updateFormInput({ authorAlias: '', comment: '' })
    setValidated(true);
    setUpdate(true);
    handleReset();
  }

  const handleReset = () => {
    formRef.current.reset();
    setValidated(false);
  };

  return (
    <React.Fragment>
      {nft && (
        <Container>
          <Row className="justify-content-center" >
            {/* This will contain the details of the nft */}
            <Card border="dark" style={{ width: '50vw' }} className="my-3">
              <Card.Img variant="top" src={nft.image} style={{ height: '100%', width: '100%', paddingTop: '1rem', objectFit: 'cover' }} />
              <Card.Body>
                <Card.Title as="h2" className="text-center py-1" >{nft.name}</Card.Title>
                <Card.Text>
                  <Row>
                    <Col sm={4} md={3} lg={2}><strong>Description</strong></Col>
                    <Col>{nft.description}</Col>
                  </Row>
                  <Row>
                    <Col sm={4} md={3} lg={2}><strong>Author</strong></Col>
                    <Col>{nftDetails.author_alias}</Col>
                  </Row>
                  <Row>
                    <Col sm={4} md={3} lg={2}><strong>Created</strong></Col>
                    <Col>{nftMetadata.created_date}</Col>
                    <Col md={1} lg={1}>
                      {/* Favourites: {nftMetadata.favorites} */}
                      <FontAwesomeIcon className='detail-fav-icon' icon={solidHeart} title="Favourite" />
                      <span className='detail-num-fav'>{nftMetadata.favorites}</span>
                    </Col>
                    <Col md={1} lg={1}>
                      <FontAwesomeIcon className='detail-view-icon' icon={faEye} title="View" />
                      <span className='num-view'>{nftMetadata.nft_views}</span>
                    </Col>
                  </Row>
                </Card.Text>
              </Card.Body>
            </Card>
          </Row>
          <Row>
            <Container>
              {/* This will contain the comments */}
              <h2> Comments {nftMetadata.nft_comments}</h2>
                { !nftComment.length && <p>No comment yet.</p> }
              <Form ref={formRef} validated={validated} onSubmit={(e) => postComment(e)}>
                <Row>
                  <Col fluid="md">
                    <Form.Group className="mb-3" controlId="formAssetName">
                      <Form.Control as="textarea" rows={3} placeholder="Comment" onChange={e => updateFormInput({ ...formInput, comment: e.target.value })} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className='post-comment-row'>
                  <Col md={{ span: 1, offset: 5 }}>
                    <h6>Post as:</h6>
                  </Col>
                  <Col md={{ span: 3 }}>
                    <Form.Group className="mb-3" controlId="formAssetName">
                      <Form.Control type="text" placeholder="Name" onChange={e => updateFormInput({ ...formInput, authorAlias: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col md={{ span: 3 }}>
                    <div className="d-grid gap-2">
                      <Button variant="primary" type="submit">
                        Post
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Container>
          </Row>

            <Row>
            {nftComment.map((comment) => <Comment comment={comment} />)}
          </Row>
        </Container>
      )}
    </React.Fragment>
  );
}