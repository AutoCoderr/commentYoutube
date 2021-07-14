import {Router} from "express";
import checkVideoExist from "../lib/checkVideoExist";
import Comment from "../models/Comment";
import JWTMiddleWare from "../middlewares/JWTMiddleWare";
import User from "../models/User";
import getOrCreateUser from "../lib/getOrCreateUser";

const CommentRouter = Router();

CommentRouter.use(JWTMiddleWare);

CommentRouter.post('/:yvideo_id', async (req,res) => {
    if (req.body.content == undefined) {
        res.sendStatus(400);
        return;
    }

    if (!await checkVideoExist(req.params.yvideo_id))
        res.sendStatus(404);
    else {
        let user: null|User = await getOrCreateUser(req.user);
        await new Comment({
            content: req.body.content,
            yvideo_id: req.params.yvideo_id,
            UserId: user.id
        }).save();

        res.send(200);
    }
});

export default CommentRouter;