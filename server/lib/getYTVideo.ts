import https from "https";

const videosCache = {};

export default function getYTVideo(ytvideo_id) {
    return {
        title: "Une vidéo random",
        views: 42,
        author: "TOTO",
        channelId: 1234,
        description: "WESH LES GENS C'EST SQUEEZIE\nCAVA ???\nezdhezfezfe"
    };
    return new Promise(resolve => {
        if (ytvideo_id.length < 11) {
            resolve(false);
            return;
        } else if (ytvideo_id.length > 11)
            ytvideo_id = ytvideo_id.substring(0,11);

        if (videosCache[ytvideo_id] != undefined) {
            if (new Date().getTime() - videosCache[ytvideo_id].date.getTime() > 1000*60*10) {
                delete videosCache[ytvideo_id];
            } else {
                resolve(videosCache[ytvideo_id].infos);
                return;
            }
        }
        const yrequest = https.request({
            host: 'www.youtube.com',
            path: '/watch?v='+ytvideo_id
        },yres => {
            let data: any = [];
            yres.on("data", chunk => data.push(chunk));
            yres.on("end", () => {
                data = Buffer.concat(
                    data,
                    data.reduce((acc, item) => acc + item.length, 0)
                ).toString();
                let toFind = "ytInitialPlayerResponse";
                let i=0;
                while (i < data.length-toFind.length && data.substring(i,i+toFind.length) != toFind) {
                    i++;
                }
                if (i >= data.length-toFind.length) {
                    resolve(false);
                    return;
                }
                i += toFind.length+3;
                let quote = null;
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
                resolve(infos);
            });
        });
        yrequest.end();
    })
}
