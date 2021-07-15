import {Router} from "express";
import checkVideoExist from "../lib/checkVideoExist";
import Comment from "../models/Comment";
import JWTMiddleWare from "../middlewares/JWTMiddleWare";
import User from "../models/User";
import getOrCreateUser from "../lib/getOrCreateUser";

const CommentRouter = Router();

CommentRouter.use(JWTMiddleWare);

CommentRouter.post('/:ytvideo_id', async (req,res) => {
    if (req.body.content == undefined || req.body.content.trim() == "") {
        res.sendStatus(400);
        return;
    }

    if (!await checkVideoExist(req.params.ytvideo_id))
        res.sendStatus(404);
    else {
        let user: null|User = await getOrCreateUser(req.user);
        await new Comment({
            content: req.body.content,
            ytvideo_id: req.params.ytvideo_id,
            UserId: user.id
        }).save();

        res.sendStatus(201);
    }
});

CommentRouter.get("/:ytvideo_id", (req,res) => {
    const nbCommentByPage = 50;
    const page = req.query.page && parseInt(req.query.page).toString() == req.query.page && req.query.page != "NaN" ? parseInt(req.query.page) : 1;
    Comment.findAll({
        where: {
            ytvideo_id: req.params.ytvideo_id
        },
        order: [
            ['createdAt','DESC']
        ],
        offset: (page-1)*nbCommentByPage,
        limit: nbCommentByPage,
        include: User
    })
        .then((comments) =>
            Comment.count().then(count => res.json({count,nbCommentByPage,comments}) )
        ) // @ts-ignore
        .catch(e => console.error(e) | res.sendStatus(500))
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