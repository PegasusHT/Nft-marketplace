import { Card, Button } from 'react-bootstrap';

export default function MarketNFT(props) {
  const { nft, buy_action, favourite } = props;

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={nft.image} />
      <Card.Body>
        <Card.Title>{nft.name}</Card.Title>
        <Card.Text>
          {nft.description}
        </Card.Text>
        <div className="d-grid gap-2">
          <Button variant="primary" onClick={() => buy_action(nft)}>Buy NFT</Button>
          <Button variant="secondary" onClick={() => favourite(nft)}>Favourite</Button>
        </div>
      </Card.Body>
    </Card>
  );
}