import React, {useContext,useState} from 'react';
import {CommentContext} from "../../contexts/CommentContext";
import ListComments from "./ListComments";
import '../../css/comment.css';

function Comments() {
    const {comments,totalCommentCount,addComment,displayMoreComments,loadingComments} = useContext(CommentContext);

    const [commentToAdd,setCommentToAdd] = useState("");

    const handleCommentToAdd = e => {
        setCommentToAdd(e.target.value);
    }
    const sendComment = () => {
        addComment(commentToAdd);
        setCommentToAdd("");
    }

    return (
        <div>
            <h2>Il y a {totalCommentCount} commentaire{totalCommentCount > 1 ? 's' : ''}</h2>
            <h3>Ajouter un commentaire</h3>
            <textarea value={commentToAdd} onChange={handleCommentToAdd}>
                {commentToAdd}
            </textarea>
            <a className="btn send-comment-button" onClick={sendComment}>Envoyer</a>
            {
                comments.length > 0 &&
                <>
                <ListComments comments={comments}/>
                    {
                        totalCommentCount > comments.length && !loadingComments &&
                            <a className="btn plus_button" onClick={displayMoreComments}>Plus</a>
                    }
                </>
            }
        </div>
    )
}

export default Comments;
