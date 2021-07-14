import {Router} from "express";
import jwt from 'jsonwebtoken';
import {IUser} from "../models/User";
import JWTMiddleWare from "../middlewares/JWTMiddleWare";

const SessionRouter = Router();

SessionRouter.post('/login-anon', (req,res) => {
    const user: IUser = {
        id: rand(10**9,10**10-1),
        type: "anon",
        firstname: 'User',
        lastname: rand(1,1000)
    }
    res.json({
        ...user,
        token: jwt.sign(user, process.env.JWT_SECRET)
    });
});

SessionRouter.use(JWTMiddleWare);

SessionRouter.get("/test", (req,res) => {
    res.json(req.user);
})

export default SessionRouter;

const rand = (a,b) => a+Math.floor(Math.random()*(b-a+1));