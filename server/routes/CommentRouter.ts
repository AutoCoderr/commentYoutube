import {Router} from "express";
import getYTVideo from "../lib/getYTVideo";
import JWTMiddleWare from "../middlewares/JWTMiddleWare";
import getOrCreateUser from "../lib/getOrCreateUser";
import User from "../models/User";
import Reaction, {IReaction} from "../models/Reaction";
import Comment from "../models/Comment";

const CommentRouter = Router();

CommentRouter.use(JWTMiddleWare);

CommentRouter.get("/:ytvideo_id", (req, res) => {
    const nbCommentByPage = 50;
    const page = (req.query.page && parseInt(req.query.page).toString() == req.query.page && req.query.page != "NaN") ? parseInt(req.query.page) : 1;
    Comment.findAll({
        where: {
            ytvideo_id: req.params.ytvideo_id,
            ParentId: null
        },
        order: [
            ['createdAt', 'DESC']
        ],
        include: [
            User,
            {model: Comment, as: 'children', attributes: ['id']},
            Reaction
        ],
        offset: (page - 1) * nbCommentByPage,
        limit: nbCommentByPage,
    })
        .then((comments) =>
            Comment.count({
                where: {
                    ytvideo_id: req.params.ytvideo_id,
                    ParentId: null
                }
            }).then(count => res.json({
                count,
                nbCommentByPage,
                comments: comments.map(comment => ({
                    id: comment.id,
                    ytvideo_id: comment.ytvideo_id,
                    content: comment.content,
                    likes: comment.Reactions?.filter(reaction => reaction.type == "like").length ?? 0,
                    liked: comment.Reactions?.some(reaction => req.user.id == reaction.UserId && reaction.type == "like") ?? false,
                    dislikes: comment.Reactions?.filter(reaction => reaction.type == "dislike").length ?? 0,
                    disliked: comment.Reactions?.some(reaction => req.user.id == reaction.UserId && reaction.type == "dislike") ?? false,
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt,
                    UserId: comment.UserId,
                    User: comment.User,
                    nbReply: comment.children.length
                }))
            }))
        ) // @ts-ignore
        .catch(e => console.error(e) | res.sendStatus(500))
});

CommentRouter.get('/reply/:id', (req, res) => {
    Comment.findAll({
        where: {
            ParentId: req.params.id
        },
        order: [
            ['createdAt', 'ASC']
        ],
        include: [User,Reaction]
    })
        .then(comments =>
            comments.length == 0 ?
                res.sendStatus(404) :
                res.json(comments.map(comment => ({
                    id: comment.id,
                    ytvideo_id: comment.ytvideo_id,
                    content: comment.content,
                    likes: comment.Reactions?.filter(reaction => reaction.type == "like").length ?? 0,
                    liked: comment.Reactions?.some(reaction => req.user.id == reaction.UserId && reaction.type == "like") ?? false,
                    dislikes: comment.Reactions?.filter(reaction => reaction.type == "dislike").length ?? 0,
                    disliked: comment.Reactions?.some(reaction => req.user.id == reaction.UserId && reaction.type == "dislike") ?? false,
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt,
                    UserId: comment.UserId,
                    User: comment.User,
                })))
        )
});

CommentRouter.post('/reply/:id', (req, res) =>
    (req.body.content == undefined || req.body.content.trim() == "") ?
        res.sendStatus(400) :
        getOrCreateUser(req.user).then(user =>
            Comment.findOne({
                where: {id: req.params.id}
            })
                .then(comment =>
                    comment == null ?
                        res.sendStatus(404) :
                        comment.ParentId != null ?
                            res.sendStatus(403) :
                            new Comment({
                                ytvideo_id: comment.ytvideo_id,
                                content: req.body.content,
                                UserId: user.id,
                                ParentId: comment.id
                            }).save()
                                .then((comment) => res.status(201).json(comment)) //@ts-ignore
                                .catch(e => console.error(e) | res.sendStatus(500))
                ) //@ts-ignore
                .catch(e => console.error(e) | res.sendStatus(500))
        )
)

CommentRouter.post('/:ytvideo_id', async (req, res) => {
    if (req.body.content == undefined || req.body.content.trim() == "") {
        res.sendStatus(400);
        return;
    }

    if (!await getYTVideo(req.params.ytvideo_id))
        res.sendStatus(404);
    else {
        let user: null | User = await getOrCreateUser(req.user);
        const comment = await new Comment({
            content: req.body.content,
            ytvideo_id: req.params.ytvideo_id,
            UserId: user.id
        }).save();

        res.status(201).json(comment);
    }
});

CommentRouter.delete("/:id", (req, res) => {
    Comment.findOne({
        where: {id: req.params.id}
    })
        .then((comment) =>
            comment == null ?
                res.sendStatus(404) :
                comment.UserId != req.user.id ?
                    res.sendStatus(403) :
                    Comment.destroy({
                        where: {id: req.params.id}
                    })
                        .then(_ => res.sendStatus(204))
                        .catch(_ => res.sendStatus(500))
        )//@ts-ignore
        .catch(e => console.error(e) | res.sendStatus(500))
});

CommentRouter.put("/:id", (req, res) =>
    (req.body.content == undefined || req.body.content.trim() == "") ?
        res.sendStatus(400) :
        Comment.findOne({
            where: {id: req.params.id}
        })
            .then(comment =>
                comment == null ?
                    res.sendStatus(404) :
                    comment.UserId != req.user.id ?
                        res.sendStatus(403) :
                        (comment.content = req.body.content) && comment.save()
                            .then(_ => res.sendStatus(200)) //@ts-ignore
                            .catch(e => console.error(e) | res.sendStatus(500))
            ) //@ts-ignore
            .catch(e => console.error(e) | res.sendStatus(500))
)

const reactOnComment = async (req,res,type: 'like'|'dislike') => {
    const user = await getOrCreateUser(req.user);
    let foundReaction: undefined|Reaction;
    Comment.findOne({
        where: {id: req.params.id},
        include: Reaction
    }).then((comment) => comment == null ? res.sendStatus(404) :
        (foundReaction = (<Array<Reaction>>comment.Reactions).find(reaction => reaction.type == type && reaction.UserId == user.id)) ?
            foundReaction.destroy().then(() => res.sendStatus(204)) : (
                new Reaction({
                    CommentId: comment.id,
                    UserId: user.id,
                    type
                }).save().then(() => res.sendStatus(204)) &&
                (foundReaction = (<Array<Reaction>>comment.Reactions).find(reaction =>
                    ((type == 'like' && reaction.type == 'dislike') || (type == 'dislike' && reaction.type == 'like')) && reaction.UserId == user.id)
                ) &&
                foundReaction.destroy()
            )

    )
}

CommentRouter.put("/like/:id", (req, res) => reactOnComment(req,res,'like'));

CommentRouter.put("/dislike/:id", (req, res) => reactOnComment(req,res,'dislike'))

export default CommentRouter;
