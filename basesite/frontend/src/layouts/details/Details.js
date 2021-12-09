// Packages
import { ethers } from 'ethers'
import axios from 'axios';

import React, { useEffect, useState } from 'react'
import { Container, Card, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

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

  useEffect(() => {
    // First, update the view count by 1, then
    // Grab the NFT details and metadata from the Django API server
    if (id) {
      // This section will be eventually used to increase the view counter of the nft when the page is visited
      // fetch('http://localhost:8000/api/create_nft/', {
      //   method: 'POST',
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     'token_id': 'https://ipfs.infura.io/ipfs/' + id,
      //     'author_alias': 'test'
      //   })
      // }).then((response) => response.json())
      //   .then((json) => {
      //     console.log(json);
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //   });
        
      fetch('http://localhost:8000/api/nft_details/?token_id=https://ipfs.infura.io/ipfs/' + id, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      }).then((response) => response.json())
        .then((result) => {
          const nft_details = result && result.length > 0 && result[0].fields;
          const nft_metadata = result && result.length > 1 && result[1].fields;

          setNftDetails(nft_details);
          setNftMetadata(nft_metadata);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    loadNFTs();
  }, [id]);

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
                    <Col md={1} lg={1}>Favourites: {nftMetadata.favorites}</Col>
                    <Col md={1} lg={1}>Views: {nftMetadata.nft_views}</Col>
                  </Row>
                </Card.Text>
              </Card.Body>
            </Card>
          </Row>
          <Row>
            {/* This will contain the comments */}
            <h2>Comments</h2>
          </Row>
        </Container>
      )}
      </React.Fragment>
  );
}