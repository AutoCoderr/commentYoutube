import React, {useContext} from 'react';
import {CommentContext} from "../../contexts/CommentContext";
import {SessionContext} from "../../contexts/SessionContext";

function ListComments({comments}) {
    const {deleteComment,showEditComment,updateTextEditComment,cancelEditComment,editComment} = useContext(CommentContext);
    const session = useContext(SessionContext);

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
                                <textarea onChange={(e) => updateTextEditComment(comment,e.target.value)}>
                                    {comment.textEdit}
                                </textarea> :
                                    comment.content
                        }
                                </div>
                        <div>
                            {
                                session && !comment.editing && comment.UserId === session.id &&
                                    <div className="commentButtons">
                                        <a onClick={() => window.confirm("Voulez vous vraiment supprimer ce commentaire?") && deleteComment(comment)}>Supprimer</a>
                                        <a onClick={() => showEditComment(comment)}>Editer</a>
                                    </div>
                            }
                            {
                                comment.editing &&
                                    <>
                                        <a onClick={() => editComment(comment)}>Valider</a>
                                        <a onClick={() => cancelEditComment(comment)}>Annuler</a>
                                    </>
                            }
                            {
                                comment.error &&
                                    <p style={{color: 'red'}}>{comment.error}</p>
                            }
                        </div>
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