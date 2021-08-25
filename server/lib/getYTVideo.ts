import request from "./request";

const videosCache = {};

export default async function getYTVideo(ytvideo_id) {
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
    } catch (e) {}
    videosCache[ytvideo_id] = {date: new Date(), infos};
    return infos;
}
