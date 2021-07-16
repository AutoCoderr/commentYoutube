import https from "https";

const videosCache = {};

export default function getYTVideo(ytvideo_id) {
    return new Promise(resolve => {
        if (ytvideo_id.length < 11) {
            resolve(false);
            return;
        } else if (ytvideo_id.length > 11)
            ytvideo_id = ytvideo_id.substring(0,11);

        if (videosCache[ytvideo_id] != undefined) {
            resolve(videosCache[ytvideo_id]);
            return;
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
                let res: any = false;
                let json: any = null
                try {
                    json = JSON.parse(obj)
                    res = json.playabilityStatus.status == "OK" ?
                        {
                            title: json.videoDetails.title,
                            views: json.videoDetails.viewCount,
                            author: json.videoDetails.author,
                            channelId: json.videoDetails.channelId,
                            description: json.videoDetails.shortDescription
                        }/*json*/ :
                        false;
                } catch (e) {}
                videosCache[ytvideo_id] = res;
                resolve(res);
            });
        });
        yrequest.end();
    })
}