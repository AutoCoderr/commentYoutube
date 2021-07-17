import SessionService from "./SessionService";
import RequestService from "./RequestService";

const apiPath = window.location.protocol+"//"+window.location.hostname+":81/comment";

export default class CommentService {
    static getComments(YTVideoID,page = 1) {
        return fetch(apiPath+"/"+YTVideoID+"?page="+page)
            .then(res => res.json())
    }

    static sendComment(YTVideoId,content,token) {
        return SessionService.checkIfTokenExpired(token,token =>
            fetch(apiPath+"/"+YTVideoId, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: RequestService.formatUrlEncoded({content,token})
            })
        )
    }
}