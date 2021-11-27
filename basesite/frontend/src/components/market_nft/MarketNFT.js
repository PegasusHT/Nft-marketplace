import { Card, Button } from 'react-bootstrap';

export default function MarketNFT(props) {
  const { nft, buy_action } = props;

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={nft.image} />
      <Card.Body>
        <Card.Title>{nft.name}</Card.Title>
        <Card.Text>
          {nft.description}
        </Card.Text>
        <Button variant="primary" onClick={() => buy_action(nft)}>Buy NFT</Button>
      </Card.Body>
    </Card>
  );
}