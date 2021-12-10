
import { useState } from 'react'
import { useNavigate } from "react-router";

import { Container,Card } from 'react-bootstrap';
import '../App.css'



export default function Comment(props) {
const { comment } = props;
console.log(comment)

  return (
    <Container className='comment-container'>
        <Card>
        <Card.Header> <h5>{comment.author_alias}</h5></Card.Header>
        <Card.Body>
            <Card.Text> {comment.comment}</Card.Text>
        </Card.Body>
        </Card>
    </Container>
  )
}