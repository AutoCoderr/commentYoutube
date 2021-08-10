import React, {useContext,useState,useEffect} from 'react';
import {CommentContext} from "../../contexts/CommentContext";
import {SessionContext} from "../../contexts/SessionContext";
import ListComments from "./ListComments";

function Comments() {
    const {comments,nbPage,currentPage,commentCount,addComment} = useContext(CommentContext);

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
            <h2>Il y a {commentCount} commentaire{commentCount > 1 ? 's' : ''}</h2>
            <h3>Ajouter un commentaire</h3>
            <textarea value={commentToAdd} onChange={handleCommentToAdd}>
                {commentToAdd}
            </textarea>
            <a className="send-comment-button" onClick={sendComment}>Envoyer</a>
            {
                comments.length > 0 &&
                <ListComments comments={comments}/>
            }
        </div>
    )
}

export default Comments;