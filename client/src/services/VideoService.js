import React from "react";

const apiPath = window.location.protocol+'//'+window.location.hostname+":3001";
const linkRegex = new RegExp("http(s)?:\\/\\/[a-zA-Z0-9./\\-_?&=]+/?");

export default class VideoService {

    static getYTVideo(ytvideo_id) {
        return fetch(apiPath+'/get_yt_video/'+ytvideo_id)
            .then(res => res.status === 200 ? res.json() : false)
    }

    static computeDescription(descriptionString) {
        let splittedDescription = descriptionString.split("\n").map(line => line.split(" "));
        return (
            <>
                {splittedDescription.map((line,indexL) =>
                    [...line.map((word,indexW) =>
                            <span key={indexL+"-"+indexW}>
                                {this.computeDescriptionWord(word)}
                                        <> </>
                            </span>
                    ), <br key={indexL+"-br"}></br>]
                )}
            </>
        )

    }
    static computeDescriptionWord(word) {
        if (linkRegex.test(word)) {
            const link = word.match(linkRegex);

            const beginI = link.index;
            const endI = beginI+link[0].length;

            const toAddBefore = word.substring(0,beginI).split("");
            const toAddAfter = word.substring(endI).split("");
            return <>{toAddBefore.length > 0 && toAddBefore}<a href={link[0]} target="_blank">{link[0]}</a>{toAddAfter.length > 0 && toAddAfter}</>;
        } else {
            return <>{word}</>;
        }
    }

    static formatViews(views) {
        let nbSpaceAdded = 0;
        views = views.toString();
        for (let i=views.length-1;i>0;i--) {
            if ((views.length-i-nbSpaceAdded) % 3 === 0) {
                views = views.substring(0,i)+" "+views.substring(i);
                nbSpaceAdded += 1;
                i -= 1;
            }
        }
        return views;
    }
}
