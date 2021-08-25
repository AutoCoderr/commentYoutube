import React from "react";

const apiPath = window.location.protocol+'//'+window.location.hostname+":3001";

export default class VideoService {

    static getYTVideo(ytvideo_id) {
        return fetch(apiPath+'/get_yt_video/'+ytvideo_id)
            .then(res => res.status === 200 ? res.json() : false)
    }
}
