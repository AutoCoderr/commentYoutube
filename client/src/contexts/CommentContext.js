import React, {createContext,useState,useEffect, useCallback} from 'react';
import CommentService from "../services/CommentService";
import useQuery from "../useQuery";

export const CommentContext = createContext();

export function CommentProvider({children}) {
    const [comments, setComments] = useState([]);
    const [nbPage, setNbPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [commentCount, setCommentCount] = useState(0);

    const ytvideo_id = useQuery().get("v");

    const editComment = useCallback(
        (commentToEdit) => CommentService.editComment(commentToEdit.id,commentToEdit.textEdit)
            .then(({res}) => setComments(comments.map(comment =>
                comment.id === commentToEdit.id ?
                    {
                        ...commentToEdit,
                        editing: false,
                        error: res.status === 400 ?
                            "Requête incomplête" :
                            res.status === 404 ?
                                "Ce commentaire n'existe pas" :
                                res.status === 403 ?
                                    "Vous n'avez pas la permission, ou votre session a expirée"
                                    : null,
                        content: res.status === 200 ? commentToEdit.textEdit : commentToEdit.content,
                        updatedAt: res.status === 200 ? new Date() : commentToEdit.updatedAt
                    } : comment
            )))
        , [comments]
    )

    const updateTextEditComment = useCallback(
        (commentToEdit, textEdit) => setComments(comments.map(comment =>
            comment.id === commentToEdit.id ?
                {...comment, textEdit} : comment
        ))
    , [comments]);

    const showEditComment = useCallback(
        (commentToEdit) => setComments(comments.map(comment =>
                ({
                    ...comment,
                    editing: comment.id === commentToEdit.id,
                    textEdit: comment.content
                })
        ))
        , [comments]
    )

    const cancelEditComment = useCallback(
        (commentToCancel) => setComments(comments.map(comment =>
            comment.id === commentToCancel.id ?
                {
                    ...comment,
                    editing: false
                } : comment
        ))
        , [comments]
    )

    const addComment = useCallback((content) => content.trim() !== "" &&
        CommentService.sendComment(ytvideo_id,content)
            .then(async ({res,session}) => ({comment: await res.json(), session}))
            .then(({comment,session}) =>
                setComments([{
                    ...comment,
                    User: session,
                    createdAt: new Date(comment.createdAt),
                    updatedAt: new Date(comment.updatedAt),
                    nbReply: 0
                }, ...comments]) | setCommentCount(commentCount+1)
            ), [commentCount,comments])

    const deleteComment = useCallback((commentToDelete) =>
        CommentService.deleteComment(commentToDelete.id)
            .then(({res}) =>
                res.status === 204 ?
                    setComments(comments.filter(comment => comment.id !== commentToDelete.id)) | setCommentCount(commentCount-1) :
                    setComments(comments.map(comment =>
                        comment.id !== commentToDelete.id ? comment : {...comment, error: (res.status === 403 ? "Vous n'avez pas la permission, ou votre session a expirée" : "Ce commentaire n'existe pas")}
                    ))
            ), [comments,commentCount])

    useEffect(() => {
        CommentService.getComments(ytvideo_id)
            .then(res =>
                setComments(res.comments.map(comment => ({
                    ...comment,
                    createdAt: new Date(comment.createdAt),
                    updatedAt: new Date(comment.updatedAt),
                    editing: false,
                    textEdit: ""
                }))) |
                setNbPage(Math.floor(res.count/res.nbCommentByPage)+(res.count%res.nbCommentByPage !== 0 ? 1 : 0)) |
                setCommentCount(res.count)
            );

    }, []);

    return (
        <CommentContext.Provider value={{comments,nbPage,currentPage,commentCount,addComment,deleteComment,updateTextEditComment,showEditComment,cancelEditComment,editComment}}>
            {children}
        </CommentContext.Provider>
    )
}