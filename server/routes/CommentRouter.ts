import {Router} from "express";
import checkVideoExist from "../lib/checkVideoExist";
import Comment, {IComment} from "../models/Comment";
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

        res.send(200);
    }
});

CommentRouter.get("/:ytvideo_id", (req,res) => {
    const nbCommentByPage = 50;
    const page = req.query.page && parseInt(req.query.page).toString() == req.query.page && req.query.page != "NaN" ? parseInt(req.query.page) : 1;
    Comment.findAll({where: {
        ytvideo_id: req.params.ytvideo_id},
        offset: (page-1)*nbCommentByPage,
        limit: nbCommentByPage,
        include: User
    })
        .then((comments: Array<IComment>) =>
            Comment.count().then(count => res.json({count,nbCommentByPage,comments}) )
        )
        .catch(_ => res.sendStatus(500))
});

export default CommentRouter;