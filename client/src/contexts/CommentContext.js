import React, {createContext,useState,useEffect, useCallback} from 'react';
import CommentService from "../services/CommentService";
import useQuery from "../useQuery";

export const CommentContext = createContext();

export function CommentProvider({children}) {
    const [comments, setComments] = useState([]);
    const [totalCommentCount, setTotalCommentCount] = useState(0);
    const [nbCommentByPage,setNbCommentByPage] = useState(0);
    const [loadingComments,setLoadingComments] = useState(true);

    const ytvideo_id = useQuery().get("v");

    const showReplies = useCallback(
        (commentToShowAnswers) => setComments(comments.map(comment =>
          comment.id === commentToShowAnswers.id ?
              {...comment, showReplies: true} :
              comment
        )) | (
            commentToShowAnswers.replies.length === 0 &&
            CommentService.getReplies(commentToShowAnswers.id).then(replies => setComments(comments.map(comment =>
                comment.id === commentToShowAnswers.id ?
                    {
                        ...comment,
                        replies: replies.map(reply => ({
                            ...reply,
                            createdAt: new Date(reply.createdAt),
                            updatedAt: new Date(reply.updatedAt)
                        })),
                        showReplies: true
                    } :
                    comment
            )))
        ), [comments]
    )

    const showOrHideNewReply = useCallback(
        (commentToShowNewReply) => setComments(comments.map(comment =>
                ({
                    ...comment,
                    showNewReply: comment.id === commentToShowNewReply.id ? !comment.showNewReply : false
                })
        )), [comments]
    )

    const hideReply = useCallback(
        (commentToHideAnswers) => setComments(comments.map(comment =>
            comment.id === commentToHideAnswers.id ?
                {
                    ...comment,
                    showReplies: false
                } :
                comment)
        ), [comments]
    )

    const editCommentMapper = useCallback(
        (comment,res) => ({
            ...comment,
            editing: false,
            error: res.status === 400 ?
                "Requête incomplête" :
                res.status === 404 ?
                    "Ce commentaire n'existe pas" :
                    res.status === 403 ?
                        "Vous n'avez pas la permission, ou votre session a expirée"
                        : null,
            content: res.status === 200 ? comment.textEdit : comment.content,
            updatedAt: res.status === 200 ? new Date() : comment.updatedAt
        }), []
    )

    const editComment = useCallback(
        (commentToEdit,parent) => CommentService.editComment(commentToEdit.id,commentToEdit.textEdit)
            .then(({res}) => setComments(comments.map(comment =>
                comment.id === parent ?
                    {
                        ...comment,
                        replies: comment.replies.map(reply =>
                            reply.id === commentToEdit.id ?
                                editCommentMapper(reply,res) :
                                reply
                        )
                    } :
                    comment.id === commentToEdit.id ?
                        editCommentMapper(comment,res) :
                        comment
            )))
        , [comments]
    )

    const updateTextEditComment = useCallback(
        (commentToEdit, textEdit, parent) => setComments(comments.map(comment =>
            comment.id === parent ?
                {
                    ...comment,
                    replies: comment.replies.map(reply =>
                        reply.id === commentToEdit.id ?
                            {...reply, textEdit} :
                            reply
                    )
                } : comment.id === commentToEdit.id ?
                {...comment, textEdit} : comment
        ))
    , [comments]);

    const updateNewReplyText = useCallback(
        (parentToAnswer, newReplyText) => setComments(comments.map(comment =>
            comment.id === parentToAnswer.id ?
                {...comment, newReplyText} : comment
        ))
        , [comments]);

    const showEditComment = useCallback(
        (commentToEdit) => setComments(comments.map(comment =>
                ({
                    ...comment,
                    editing: comment.id === commentToEdit.id,
                    textEdit: comment.content,
                    replies: comment.replies.map(reply => ({
                            ...reply,
                            editing: reply.id === commentToEdit.id,
                            textEdit: reply.content,
                        }))
                })
        ))
        , [comments]
    )

    const cancelEditComment = useCallback(
        (commentToCancel,parent) => setComments(comments.map(comment =>
            comment.id === parent ?
                {
                    ...comment,
                    replies: comment.replies.map(reply =>
                        reply.id === commentToCancel.id ?
                            {
                                ...reply,
                                editing: false
                            } : reply
                    )
                } :
                comment.id === commentToCancel.id ?
                    {
                        ...comment,
                        editing: false
                    } : comment
        ))
        , [comments]
    )

    const addComment = useCallback((content,parent = null) => content.trim() !== "" &&
        CommentService.sendComment(ytvideo_id,content,parent)
            .then(async ({res,session}) => ({comment: await res.json(), session}))
            .then(({comment: addedComment,session}) =>
                setComments(parent == null ?[{
                    ...addedComment,
                    User: session,
                    createdAt: new Date(addedComment.createdAt),
                    updatedAt: new Date(addedComment.updatedAt),
                    nbReply: 0,
                    replies: [],
                    editing: false,
                    textEdit: "",
                    newReplyText: "",
                    showNewReply: false,
                    showReplies: false
                }, ...comments] :
                    comments.map(comment =>
                        comment.id === parent ?
                            {
                                ...comment,
                                nbReply: comment.nbReply+1,
                                showReplies: true,
                                newReplyText: '',
                                showNewReply: false,
                                replies: [...comment.replies, {
                                    ...addedComment,
                                    User: session,
                                    createdAt: new Date(addedComment.createdAt),
                                    updatedAt: new Date(addedComment.updatedAt)
                                }]
                            } : comment
                    )
                ) | (parent == null && setTotalCommentCount(totalCommentCount+1))
            ), [totalCommentCount,comments,ytvideo_id])

    const errorDeleteCommentMapper = useCallback(
        (comment,res) => ({...comment, error: (res.status === 403 ? "Vous n'avez pas la permission, ou votre session a expirée" : "Ce commentaire n'existe pas")})
        , []
    )

    const deleteComment = useCallback((commentToDelete,parent) =>
        CommentService.deleteComment(commentToDelete.id)
            .then(({res}) =>
                res.status === 204 ?
                    parent == null ?
                        setComments(comments.filter(comment => comment.id !== commentToDelete.id)) | setTotalCommentCount(totalCommentCount-1) :
                        setComments(comments.map(comment =>
                            comment.id === parent ?
                                {
                                    ...comment,
                                    showReplies: comment.replies.length > 1,
                                    nbReply: comment.nbReply-1,
                                    replies: comment.replies.filter(reply => reply.id !== commentToDelete.id)
                                } :
                                comment
                        )) :
                    setComments(comments.map(comment =>
                        parent === comment.id ?
                            {
                                ...comment,
                                replies: comment.replies.map(reply =>
                                    reply.id === commentToDelete.id ?
                                        errorDeleteCommentMapper(reply,res) :
                                        reply
                                )
                            } :
                        comment.id === commentToDelete.id ?
                            errorDeleteCommentMapper(comment,res) :
                            comment
                    ))
            ), [comments,totalCommentCount])

    const getComments = useCallback(
        (page = 1) => CommentService.getComments(ytvideo_id,page)
            .then(res => setLoadingComments(false) |
                setComments([...comments, ...res.comments.map(comment => ({
                    ...comment,
                    createdAt: new Date(comment.createdAt),
                    updatedAt: new Date(comment.updatedAt),
                    editing: false,
                    textEdit: "",
                    newReplyText: "",
                    showNewReply: false,
                    replies: [],
                    showReplies: false
                }))]) |
                (nbCommentByPage !== res.nbCommentByPage && setNbCommentByPage(res.nbCommentByPage)) |
                (totalCommentCount !== res.count && setTotalCommentCount(res.count))
            ),
        [comments,totalCommentCount,nbCommentByPage]
    )

    const displayMoreComments = useCallback(
        () => setLoadingComments(true) |
            getComments(Math.floor(comments.length/nbCommentByPage)+1),
        [comments,totalCommentCount,nbCommentByPage]
    )

    useEffect(() => getComments(), []);

    return (
        <CommentContext.Provider value={{comments,addComment,totalCommentCount,deleteComment,updateTextEditComment,showEditComment,cancelEditComment,editComment,showReplies,hideReply,updateNewReplyText,showOrHideNewReply,displayMoreComments,loadingComments}}>
            {children}
        </CommentContext.Provider>
    )
}
