import React, {createContext,useState,useEffect} from 'react';
import CommentService from "../services/CommentService";
import useQuery from "../services/useQuery";

export const CommentContext = createContext();

export function CommentProvider({children}) {
    const [comments, setComments] = useState([]);
    const [nbPage, setNbPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [commentCount, setCommentCount] = useState(0);

    const ytvideo_id = useQuery().get("v");

    const date = new Date();

    const addComment = (content,session) => content.trim() !== "" &&
        CommentService.sendComment(ytvideo_id,content,session)
            .then(async ({res,session}) => ({comment: await res.json(), session}))
            .then(({comment,session}) =>
            setComments([{
                ...comment,
                User: session,
                createdAt: new Date(comment.createdAt),
                updatedAt: new Date(comment.updatedAt),
                nbReply: 0
            }, ...comments]) | setCommentCount(commentCount+1)
        );

    const deleteComment = (commentToDelete,session) =>
        CommentService.deleteComment(commentToDelete.id,session)
            .then(({res}) =>
                res.status === 204 ?
                    setComments(comments.filter(comment => comment.id !== commentToDelete.id)) | setCommentCount(commentCount-1) :
                    setComments(comments.map(comment =>
                            comment.id !== commentToDelete.id ? comment : {...comment, error: (res.status === 403 ? "Erreur : Vous n'avez pas la permission, ou votre session a expirée" : "Ce commentaire n'existe pas")}
                        ))
            );

    useEffect(() => {
        CommentService.getComments(ytvideo_id)
            .then(res =>
                setComments(res.comments.map(comment => ({
                    ...comment,
                    createdAt: new Date(comment.createdAt),
                    updatedAt: new Date(comment.updatedAt)
                }))) |
                setNbPage(Math.floor(res.count/res.nbCommentByPage)+(res.count%res.nbCommentByPage !== 0 ? 1 : 0)) |
                setCommentCount(res.count)
            );

    }, []);

    return (
        <CommentContext.Provider value={{comments,nbPage,currentPage,commentCount,addComment,deleteComment}}>
            {children}
        </CommentContext.Provider>
    )
}