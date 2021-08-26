import React, {useContext} from 'react';
import {CommentContext} from "../../contexts/CommentContext";
import {SessionContext} from "../../contexts/SessionContext";

import '../../css/listComments.css';
import likeImg from '../../images/like.png';
import dislikeImg from '../../images/dislike.png';
import downChevron from '../../images/down-chevron.png';

import FormatService from "../../services/FormatService";

function ListComments({comments, parent = null}) {
    const {deleteComment,showOrHideEditComment,updateTextEditComment,editComment,showReplies,hideReply,updateNewReplyText,addComment,showOrHideNewReply,showOrHideCommentMenu,reactComment} = useContext(CommentContext);
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
                        {
                            session && comment.UserId === session.id &&
                            <span className="comment_menu">
                                <img src={downChevron} onClick={() => showOrHideCommentMenu(comment,parent)}/>
                                    {
                                        comment.showMenu &&
                                        <ul>
                                            <li onClick={() => showOrHideEditComment(comment)}>éditer</li>
                                            <li onClick={() => window.confirm("Voulez vous vraiment supprimer ce commentaire?") && deleteComment(comment,parent)}>Supprimer</li>
                                        </ul>
                                    }
                            </span>
                        }
                        <div className="body">
                        {
                            comment.editing ?
                                <textarea value={comment.textEdit} onChange={(e) => updateTextEditComment(comment,e.target.value,parent)}>
                                    {comment.textEdit}
                                </textarea> :
                                FormatService.computeMessage(comment.content)
                        }
                        </div>
                        {
                            !comment.editing &&
                            <div className="comment_back">
                                <div className="likes_and_dislikes">
                                    <span onClick={() => reactComment(comment,parent,'like')}>
                                    <img className={comment.liked ? 'reacted' : ''} src={likeImg}/>
                                        {comment.likes}
                                    </span>
                                    <span onClick={() => reactComment(comment,parent,'dislike')}>
                                        <img className={comment.disliked ? 'reacted' : ''} src={dislikeImg}/>
                                        {comment.dislikes}
                                    </span>
                                </div>
                                {
                                    parent == null &&
                                    <a className="btn" onClick={() => showOrHideNewReply(comment)}>Répondre</a>
                                }
                            </div>
                        }
                        <div>
                            {
                                comment.editing &&
                                    <div className="commentButtons">
                                        <a className="btn" onClick={() => editComment(comment,parent)}>Valider</a>
                                        <a className="btn" onClick={() => showOrHideEditComment(comment)}>Annuler</a>
                                    </div>
                            }
                            {
                                comment.error &&
                                    <p style={{color: 'red'}} className="errors">{comment.error}</p>
                            }
                        </div>
                        { parent == null &&
                        <div className="answers">
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
                                comment.showNewReply &&
                                    <>
                                        <textarea className="reply-text" value={comment.newReplyText} onChange={(e) => updateNewReplyText(comment, e.target.value)}>
                                            {comment.newReplyText}
                                        </textarea>
                                        <a className="btn" onClick={() => addComment(comment.newReplyText,comment.id)}>Envoyer</a>
                                        <a className="btn" onClick={() => showOrHideNewReply(comment)}>Annuler</a>
                                    </>
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
