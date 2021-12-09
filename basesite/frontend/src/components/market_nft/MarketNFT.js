import { Card, Button } from 'react-bootstrap';

import { useNavigate } from "react-router";

export default function MarketNFT(props) {
  const { nft, buy_action, favourite } = props;
  const navigate = useNavigate();

  const nftHash = nft && nft.tokenUri.replace('https://ipfs.infura.io/ipfs/','');

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
          <Button variant="secondary" onClick={() => favourite(nft)}>Favourite</Button>
          <Button variant="secondary" onClick={() => navigate(`/nft/${nftHash}`)}>Details</Button>
        </div>
      </Card.Body>
    </Card>
  );
}