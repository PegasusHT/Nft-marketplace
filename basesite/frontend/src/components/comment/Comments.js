import { useState } from 'react'
import { useNavigate } from "react-router";
import { Container,Card } from 'react-bootstrap';
import '../App.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as regularThumbsUp, faThumbsDown as regularThumbsDown } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as solidThumbsUp, faThumbsDown as solidThumbsDown, faCoins} from "@fortawesome/free-solid-svg-icons";

export default function Comment(props) {
const { comment } = props;
console.log("Comment id: " + comment.id)

    const [upVoteIcon, setUpVoteIcon] = useState(regularThumbsUp);
    const [upVoteCount, setUpVoteCount] = useState(comment.up_votes);
    const [downVoteIcon, setDownVoteIcon] = useState(regularThumbsDown);
    const [downVoteCount, setDownVoteCount] = useState(comment.down_votes);
    const [tipsCount, setTipsCount] = useState(comment.tips);

    function upVoteComment(e, comment) {
        if (!e) var e = window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if(upVoteIcon === regularThumbsUp) {
            setUpVoteIcon(solidThumbsUp);
            setUpVoteCount(upVoteCount + 1);
            if(downVoteIcon === solidThumbsDown){
                setDownVoteCount(downVoteCount - 1);
                setDownVoteIcon(regularThumbsDown);
            }
        }
        else {
            setUpVoteIcon(regularThumbsUp);
            setUpVoteCount(upVoteCount - 1);
        }
    }

    function downVoteComment(e, comment) {
        if (!e) var e = window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if(downVoteIcon === regularThumbsDown) {
            setDownVoteIcon(solidThumbsDown);
            setDownVoteCount(downVoteCount + 1);
            if(upVoteIcon === solidThumbsUp){
                setUpVoteCount(upVoteCount - 1);
                setUpVoteIcon(regularThumbsUp);
            }
        }
        else {
            setDownVoteIcon(regularThumbsDown);
            setDownVoteCount(downVoteCount - 1);
        }
    }

    function tipsComment (e, comment){
        setTipsCount(tipsCount + 1 );

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