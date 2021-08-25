import React, {useContext} from 'react';
import {CommentContext} from "../../contexts/CommentContext";
import {SessionContext} from "../../contexts/SessionContext";
import '../../css/listComments.css';
import FormatService from "../../services/FormatService";

function ListComments({comments, parent = null}) {
    const {deleteComment,showEditComment,updateTextEditComment,cancelEditComment,editComment,showReplies,hideReply,updateNewReplyText,addComment,showOrHideNewReply} = useContext(CommentContext);
    const {session} = useContext(SessionContext);

    return (
        <ul>
            {
                comments.map(comment =>
                    <li key={comment.id} className="comment">
                        <span className="name">
                            {comment.User.firstname} {comment.User.lastname}
                        </span>
                        ({comment.User.type === "google" ? comment.User.email : 'anonyme'})
                        <span className="datetime">
                            {
                                comment.createdAt.getTime() !== comment.updatedAt.getTime() ?
                                    <>Modifié le {formatDate(comment.updatedAt)}</> :
                                    <>Ajouté le {formatDate(comment.updatedAt)}</>
                            }
                        </span>
                        <div className="body">
                        {
                            comment.editing ?
                                <textarea value={comment.textEdit} onChange={(e) => updateTextEditComment(comment,e.target.value,parent)}>
                                    {comment.textEdit}
                                </textarea> :
                                FormatService.computeMessage(comment.content)
                        }
                        </div>
                        <div>
                            {
                                session && !comment.editing && comment.UserId === session.id &&
                                    <div className="commentButtons">
                                        <a className="btn" onClick={() => window.confirm("Voulez vous vraiment supprimer ce commentaire?") && deleteComment(comment,parent)}>Supprimer</a>
                                        <a className="btn" onClick={() => showEditComment(comment)}>Editer</a>
                                    </div>
                            }
                            {
                                comment.editing &&
                                    <div className="commentButtons">
                                        <a className="btn" onClick={() => editComment(comment,parent)}>Valider</a>
                                        <a className="btn" onClick={() => cancelEditComment(comment,parent)}>Annuler</a>
                                    </div>
                            }
                            {
                                comment.error &&
                                    <p style={{color: 'red'}} className="errors">{comment.error}</p>
                            }
                        </div>
                        { parent == null &&
                        <div className={"answers"+(comment.showReplies ? " margin_bottom_replies" : "")}>
                            {(comment.nbReply > 0 && !comment.showReplies) ?
                                <a className="replies_button" onClick={() => showReplies(comment)}>Voir les réponses ({comment.nbReply})</a> :
                                (comment.replies.length === 0 && comment.showReplies) ?
                                    <p>Chargement...</p> :
                                    comment.replies.length > 0 &&
                                    <>
                                        <a className="replies_button" onClick={() => hideReply(comment)}>Masquer les
                                            réponses ({comment.nbReply}) </a>
                                        <ListComments comments={comment.replies} parent={comment.id}/>
                                    </>}
                            {
                                comment.showNewReply ?
                                    <>
                                        <textarea className="reply-text" value={comment.newReplyText} onChange={(e) => updateNewReplyText(comment, e.target.value)}>
                                            {comment.newReplyText}
                                        </textarea>
                                        <a className="btn" onClick={() => addComment(comment.newReplyText,comment.id)}>Envoyer</a>
                                        <a className="btn" onClick={() => showOrHideNewReply(comment)}>Annuler</a>
                                    </> :
                                    <a className="btn" onClick={() => showOrHideNewReply(comment)}>Répondre</a>
                            }
                        </div>
                        }
                    </li>
                )
            }
        </ul>
    )
}

const formatDate = function(date) {
    return addMissingZeros(date.getDate())+"/"+addMissingZeros(date.getMonth()+1)+"/"+date.getFullYear()+" "+addMissingZeros(date.getHours())+":"+addMissingZeros(date.getMinutes())+":"+addMissingZeros(date.getSeconds());
}

const addMissingZeros = function(number, nb = 2) {
    if (typeof(number) == "number")
        number = number.toString();

    while (number.length < nb) {
        number = '0'+number;
    }
    return number;
}

export default ListComments;
