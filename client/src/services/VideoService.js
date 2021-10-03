import React from "react";
import request from "../request";

const apiPath = window.location.protocol+'//'+window.location.hostname+":3001/video";

export default class VideoService {
    static getYTVideo(ytvideo_id) {
        return request(apiPath+'/'+ytvideo_id)
            .then(({res}) => (res.status === 200 || res.status === 304) ? res.json() : false);
    }

    static likeVideo(ytvideo_id) {
        return request(apiPath+'/like/'+ytvideo_id, {
            method: "PUT"
        });
    }

    static dislikeVideo(ytvideo_id) {
        return request(apiPath+'/dislike/'+ytvideo_id, {
            method: "PUT"
        });
    }
}
