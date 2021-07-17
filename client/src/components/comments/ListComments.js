import React, {useContext} from 'react';
import {CommentContext} from "../../contexts/CommentContext";
import {SessionContext} from "../../contexts/SessionContext";

function ListComments({comments}) {
    const {deleteComment} = useContext(CommentContext);
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
                        <p>
                            {comment.content}
                        </p>
                        <div>
                            {
                                comment.UserId === session.id &&
                                <a onClick={() => window.confirm("Voulez vous vraiment supprimer ce commentaire?") && deleteComment(comment,session)}>Supprimer</a>
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