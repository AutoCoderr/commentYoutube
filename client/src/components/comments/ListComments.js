import React from 'react';

function ListComments({comments}) {
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