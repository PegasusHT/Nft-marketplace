import {useEffect, useState} from 'react'
import { useNavigate } from "react-router";
import { Container,Card } from 'react-bootstrap';
import '../App.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as regularThumbsUp, faThumbsDown as regularThumbsDown } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as solidThumbsUp, faThumbsDown as solidThumbsDown, faCoins} from "@fortawesome/free-solid-svg-icons";
import Web3Modal from "web3modal";

export default function Comment(props) {
    const { comment } = props;
    const comment_id = comment.id;

    const [upVoteIcon, setUpVoteIcon] = useState();
    const [upVoteState, setUpVoteState] = useState(false)
    const [upVoteCount, setUpVoteCount] = useState(comment.up_votes);

    const [downVoteIcon, setDownVoteIcon] = useState();
    const [downVoteState, setDownVoteState] = useState(false)
    const [downVoteCount, setDownVoteCount] = useState(comment.down_votes);
    const [tipsCount, setTipsCount] = useState(comment.tips);

    useEffect(async () => {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const wallet_address = connection.selectedAddress

        await fetch('http://localhost:8000/api/get_comment_state/', {
            method: 'POST',
            body: JSON.stringify({
                'comment_id': comment_id,
                'wallet_address': wallet_address,
            })
        }).then((response) => response.json())
            .then((result) => {
                setUpVoteState(result[0].fields.is_up_voted);
                setDownVoteState(result[0].fields.is_down_voted);

                const isFieldUpvoted = result[0].fields.is_up_voted;
                const isFieldDownvoted = result[0].fields.is_down_voted;
                
                if(isFieldUpvoted){
                    setUpVoteIcon(solidThumbsUp)
                } else setUpVoteIcon(regularThumbsUp)
        
                if(isFieldDownvoted){
                    setDownVoteIcon(solidThumbsDown)
                } else setDownVoteIcon(regularThumbsDown)
                // console.log(upVoteIcon)
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    async function upVoteComment() {

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const wallet_address = connection.selectedAddress

        if(upVoteState === false) {
            setUpVoteIcon(solidThumbsUp);
            setUpVoteCount(upVoteCount + 1);
            if(downVoteState === true){
                setDownVoteCount(downVoteCount - 1);
                setDownVoteIcon(regularThumbsDown);
            }

            fetch('http://localhost:8000/api/up_vote_comment/', {
                method:'POST',
                body: JSON.stringify({
                    'comment_id': comment_id,
                    'wallet_address': wallet_address,
                    'is_up_voted': "True",
                })
            }) .then((response) => response.json())
                .catch((error) => {
                    console.error(error);
                });

            setUpVoteState(true)
            setDownVoteState(false)
        }
        else {
            setUpVoteIcon(regularThumbsUp);
            setUpVoteCount(upVoteCount - 1);

            fetch('http://localhost:8000/api/up_vote_comment/', {
                method:'POST',
                body: JSON.stringify({
                    'comment_id': comment_id,
                    'wallet_address': wallet_address,
                    'is_up_voted': "False"
                })
            }) .then((response) => response.json())
                .catch((error) => {
                    console.error(error);
                });

            setUpVoteState(false)
        }
    }

    async function downVoteComment() {

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const wallet_address = connection.selectedAddress

        if(downVoteState === false) {
            setDownVoteIcon(solidThumbsDown);
            setDownVoteCount(downVoteCount + 1);
            if(upVoteState === true){
                setUpVoteCount(upVoteCount - 1);
                setUpVoteIcon(regularThumbsUp);
            }

            fetch('http://localhost:8000/api/down_vote_comment/', {
                method:'POST',
                body: JSON.stringify({
                    'comment_id': comment_id,
                    'wallet_address': wallet_address,
                    'is_down_voted': "True",
                })
            }) .then((response) => response.json())
                .catch((error) => {
                    console.error(error);
                });

            setDownVoteState(true)
            setUpVoteState(false)
        }
        else {
            setDownVoteIcon(regularThumbsDown);
            setDownVoteCount(downVoteCount - 1);

            fetch('http://localhost:8000/api/down_vote_comment/', {
                method:'POST',
                body: JSON.stringify({
                    'comment_id': comment_id,
                    'wallet_address': wallet_address,
                    'is_down_voted': "False"
                })
            }) .then((response) => response.json())
                .catch((error) => {
                    console.error(error);
                });

            setDownVoteState(false)
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
                                     onClick={(e) => upVoteComment()} title="UpVote"/>
                    {upVoteCount}
                </div>
                <div>
                    <FontAwesomeIcon icon={downVoteIcon}
                                     onClick={(e) => downVoteComment()} title="DownVote"/>
                    {downVoteCount}
                </div>
                <div>
                    <FontAwesomeIcon icon={faCoins}
                                     onClick={(e) => tipsComment()} title="DownVote"/>
                    {tipsCount}
                </div>
            </div>
        </Card.Body>
        </Card>
    </Container>
  )
}