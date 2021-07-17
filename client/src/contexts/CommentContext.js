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

    const addComment = (content,session) =>
        CommentService.sendComment(ytvideo_id,content,session).then(({session}) =>
            setComments([{
                id: comments.length+1,
                ytvideo_id,
                content,
                createdAt: date,
                updatedAt: date,
                UserId: session.id,
                User: session,
                nbReply: 0
            }, ...comments]) | setCommentCount(commentCount+1)
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
        <CommentContext.Provider value={{comments,nbPage,currentPage,commentCount,addComment}}>
            {children}
        </CommentContext.Provider>
    )
}