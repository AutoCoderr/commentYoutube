import RequestService from "./RequestService";
import request from "../request";

const apiPath = window.location.protocol+"//"+window.location.hostname+":3001/comment";

export default class CommentService {
    static getComments(YTVideoID,page = 1) {
        return request(apiPath+"/"+YTVideoID+"?page="+page)
            .then(({res}) => res.json());
    }

    static getReplies(commentId) {
        return request(apiPath+"/reply/"+commentId)
            .then(({res}) => res.json());
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

    static sendComment(YTVideoId,content,parent) {
        return request(parent == null ? apiPath+"/"+YTVideoId : apiPath+"/reply/"+parent, {
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

    static likeComment(commentId) {
        return request(apiPath+'/like/'+commentId, {
            method: "PUT"
        })
    }

    static dislikeComment(commentId) {
        return request(apiPath+'/dislike/'+commentId, {
            method: "PUT"
        })
    }
}
