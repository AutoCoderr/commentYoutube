import {Router} from "express";
import getYTVideo from "../lib/getYTVideo";
import Comment from "../models/Comment";
import JWTMiddleWare from "../middlewares/JWTMiddleWare";
import User from "../models/User";
import getOrCreateUser from "../lib/getOrCreateUser";

const CommentRouter = Router();

CommentRouter.get("/:ytvideo_id", (req,res) => {
    const nbCommentByPage = 50;
    const page = (req.query.page && parseInt(req.query.page).toString() == req.query.page && req.query.page != "NaN") ? parseInt(req.query.page) : 1;
    Comment.findAll({
        where: {
            ytvideo_id: req.params.ytvideo_id,
            ParentId: null
        },
        order: [
            ['createdAt','DESC']
        ],
        include: [
            User,
            {model: Comment, as: 'children', attributes: ['id']}
        ],
        offset: (page-1)*nbCommentByPage,
        limit: nbCommentByPage,
    })
        .then((comments) =>
            Comment.count({ where: {
                    ytvideo_id: req.params.ytvideo_id,
                    ParentId: null
                }}).then(count => res.json({
                count,
                nbCommentByPage,
                comments: comments.map(comment => ({
                    id: comment.id,
                    ytvideo_id: comment.ytvideo_id,
                    content: comment.content,
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

CommentRouter.get('/reply/:id', (req,res) => {
    Comment.findAll({
        where: {
            ParentId: req.params.id
        },
        order: [
            ['createdAt', 'ASC']
        ],
        include: User
    })
        .then(comments =>
            comments.length == 0 ?
                res.sendStatus(404) :
                res.json(comments)
        )
});

CommentRouter.use(JWTMiddleWare);

CommentRouter.post('/reply/:id', (req,res) =>
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

CommentRouter.post('/:ytvideo_id', async (req,res) => {
    if (req.body.content == undefined || req.body.content.trim() == "") {
        res.sendStatus(400);
        return;
    }

    if (!await getYTVideo(req.params.ytvideo_id))
        res.sendStatus(404);
    else {
        let user: null|User = await getOrCreateUser(req.user);
        const comment = await new Comment({
            content: req.body.content,
            ytvideo_id: req.params.ytvideo_id,
            UserId: user.id
        }).save();

        res.status(201).json(comment);
    }
});

CommentRouter.delete("/:id", (req,res) => {
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

CommentRouter.put("/:id", (req,res) =>
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

export default CommentRouter;
