import React from "react";
import request from "../request";

const apiPath = window.location.protocol+'//'+window.location.hostname+":3001";

export default class VideoService {

    static getYTVideo(ytvideo_id) {
        return request(apiPath+'/get_yt_video/'+ytvideo_id)
            .then(({res}) => (res.status === 200 || res.status === 304) ? res.json() : false)
    }
}
