import React from "react";

const apiPath = window.location.protocol+'//'+window.location.hostname+":81";
const linkRegex = new RegExp("http(s)?:\\/\\/[a-zA-Z0-9./\\-_?&=]+/?");

export default class VideoService {

    static getYTVideo(ytvideo_id) {
        return fetch(apiPath+'/get_yt_video/'+ytvideo_id)
            .then(res => res.status === 200 ? res.json(): false)
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
            let link = word.match(linkRegex);
            link = link[0]

            let i = 0;
            while (i < word.length-link.length && word.substring(i,i+link.length) !== link) {
                i ++;
            }
            let beginI = i;
            let endI = beginI+link.length;

            let toAddBefore = word.substring(0,beginI).split("");
            let toAddAfter = word.substring(endI).split("");
            return <>{toAddBefore.length > 0 && toAddBefore}<a href={link} target="_blank">{link}</a>{toAddAfter.length > 0 && toAddAfter}</>;
        } else {
            return <>{word}</>;
        }
    }
}