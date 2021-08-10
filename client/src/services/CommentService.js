import RequestService from "./RequestService";
import request from "../request";

const apiPath = window.location.protocol+"//"+window.location.hostname+":81/comment";

export default class CommentService {
    static getComments(YTVideoID,page = 1) {
        return request(apiPath+"/"+YTVideoID+"?page="+page)
            .then(({res}) => res.json())
    }

    static editComment(commentId, content) {
        return request(apiPath+"/"+commentId, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: RequestService.formatUrlEncoded({content})
        })
    }

    static sendComment(YTVideoId,content) {
        return request(apiPath+"/"+YTVideoId, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: RequestService.formatUrlEncoded({content})
        });
    }

    static deleteComment(commentId) {
        return request(apiPath+'/'+commentId, {
            method: "DELETE"
        });
    }
}