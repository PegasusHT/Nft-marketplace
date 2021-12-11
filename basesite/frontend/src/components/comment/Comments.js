import { useState } from 'react'
import { useNavigate } from "react-router";
import { Container,Card } from 'react-bootstrap';
import '../App.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as regularThumbsUp, faThumbsDown as regularThumbsDown } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as solidThumbsUp, faThumbsDown as solidThumbsDown, faCoins} from "@fortawesome/free-solid-svg-icons";
import Web3Modal from "web3modal";
import {ethers} from "ethers";

export default function Comment(props) {
const { comment } = props;
const comment_id = comment.id;

    const [upVoteIcon, setUpVoteIcon] = useState(regularThumbsUp);
    const [upVoteState, setUpVoteState] = useState("False")
    const [upVoteCount, setUpVoteCount] = useState(comment.up_votes);
    const [downVoteIcon, setDownVoteIcon] = useState(regularThumbsDown);
    const [downVoteState, setDownVoteState] = useState("False")
    const [downVoteCount, setDownVoteCount] = useState(comment.down_votes);
    const [tipsCount, setTipsCount] = useState(comment.tips);

    async function upVoteComment(e, comment) {
        if (!e) var e = window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const wallet_address = connection.selectedAddress

        if(upVoteIcon === regularThumbsUp) {
            setUpVoteIcon(solidThumbsUp);
            setUpVoteCount(upVoteCount + 1);
            setUpVoteState("True")
            if(downVoteIcon === solidThumbsDown){
                setDownVoteCount(downVoteCount - 1);
                setDownVoteIcon(regularThumbsDown);
                setDownVoteState("True")
            }

            fetch('http://localhost:8000/api/up_vote_comment/', {
                method:'POST',
                body: JSON.stringify({
                    'comment_id': comment_id,
                    'wallet_address': wallet_address,
                    'is_up_voted': "True",
                    'is_down_voted': downVoteState
                })
            }) .then((response) => response.json())
                .catch((error) => {
                    console.error(error);
                });
        }
        else {
            setUpVoteIcon(regularThumbsUp);
            setUpVoteCount(upVoteCount - 1);
            setUpVoteState("False")

            fetch('http://localhost:8000/api/up_vote_comment/', {
                method:'POST',
                body: JSON.stringify({
                    'comment_id': comment_id,
                    'wallet_address': wallet_address,
                    'is_up_voted': "False",
                    'is_down_voted': downVoteState
                })
            }) .then((response) => response.json())
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    async function downVoteComment(e, comment) {
        if (!e) var e = window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const wallet_address = connection.selectedAddress

        if(downVoteIcon === regularThumbsDown) {
            setDownVoteIcon(solidThumbsDown);
            setDownVoteCount(downVoteCount + 1);
            setDownVoteState("True")
            if(upVoteIcon === solidThumbsUp){
                setUpVoteCount(upVoteCount - 1);
                setUpVoteIcon(regularThumbsUp);
                setUpVoteState("True")
            }

            fetch('http://localhost:8000/api/down_vote_comment/', {
                method:'POST',
                body: JSON.stringify({
                    'comment_id': comment_id,
                    'wallet_address': wallet_address,
                    'is_down_voted': "True",
                    'is_up_voted': upVoteState
                })
            }) .then((response) => response.json())
                .catch((error) => {
                    console.error(error);
                });
        }
        else {
            setDownVoteIcon(regularThumbsDown);
            setDownVoteCount(downVoteCount - 1);
            setDownVoteState("False")

            fetch('http://localhost:8000/api/down_vote_comment/', {
                method:'POST',
                body: JSON.stringify({
                    'comment_id': comment_id,
                    'wallet_address': wallet_address,
                    'is_down_voted': "False",
                    'is_up_voted': upVoteState
                })
            }) .then((response) => response.json())
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    function tipsComment (e, comment){
        setTipsCount(tipsCount + 1 );

        fetch('http://localhost:8000/api/tips_comment/', {
            method:'POST',
            body: JSON.stringify({
                'comment_id': comment_id,
            })
        }) .then((response) => response.json())
            .catch((error) => {
                console.error(error);
            });
    }

    return (
    <Container className='comment-container'>
        <Card>
        <Card.Header> <h5 style={{color:"blue"}}>{comment.author_alias}</h5></Card.Header>
        <Card.Body>
            <Card.Text> {comment.comment}</Card.Text>
            <div className={"reaction-div"}>
                <div>
                    <FontAwesomeIcon icon={upVoteIcon}
                                     onClick={(e) => upVoteComment(e, comment)} title="UpVote"/>
                    {upVoteCount}
                </div>
                <div>
                    <FontAwesomeIcon icon={downVoteIcon}
                                     onClick={(e) => downVoteComment(e, comment)} title="DownVote"/>
                    {downVoteCount}
                </div>
                <div>
                    <FontAwesomeIcon icon={faCoins}
                                     onClick={(e) => tipsComment(e, comment)} title="DownVote"/>
                    {tipsCount}
                </div>
            </div>
        </Card.Body>
        </Card>
    </Container>
  )
}