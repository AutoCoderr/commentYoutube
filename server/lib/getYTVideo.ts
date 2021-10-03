import request from "./request";
import Reaction from "../models/Reaction";

const videosCache = {};

export default async function getYTVideo(ytvideo_id): Promise<false|{title: string, views: string, author: string, channelId: string, description: string, reactions: Array<Reaction>}> {
    if (videosCache[ytvideo_id] && (new Date().getTime()) - videosCache[ytvideo_id].date.getTime() < 1000*60*5) {
        return {
            ...videosCache[ytvideo_id].infos, reactions: await Reaction.findAll({
                where: {YTVideo: ytvideo_id}
            })
        }
    } else if (videosCache[ytvideo_id]) {
        delete videosCache[ytvideo_id];
    }

    const data = await request("https://www.youtube.com/watch?v="+ytvideo_id);
    let toFind = "ytInitialPlayerResponse";
    let i=0;
    while (i < data.length-toFind.length && data.substring(i,i+toFind.length) != toFind) {
        i++;
    }
    if (i >= data.length-toFind.length) {
        return false;
    }
    i += toFind.length+3;
    let quote: null|string = null;
    let obj = "";
    while (i<data.length && data[i] != ";" || quote != null) {
        if (data[i] == "'" || data[i] == '"') {
            if (quote == data[i])
                quote = null
            else if (quote == null)
                quote = data[i];
            }
        obj += data[i];
        i++;
    }
    let infos: any = false;
    let json: any = null
    try {
        json = JSON.parse(obj)
        infos = json.playabilityStatus.status == "OK" ?
            {
                title: json.videoDetails.title,
                views: json.videoDetails.viewCount,
                author: json.videoDetails.author,
                channelId: json.videoDetails.channelId,
                description: json.videoDetails.shortDescription
            } :
            false;
    } catch (e) {
        console.error(e);
        return false;
    }
    videosCache[ytvideo_id] = {date: new Date(), infos};
    return {...infos, reactions: await Reaction.findAll({
            where: {YTVideo: ytvideo_id}
        })};
}
