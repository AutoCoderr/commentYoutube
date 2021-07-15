import https from "https";

const existsVideos = {};

export default function checkVideoExist(ytvideo_id) {
    return new Promise(resolve => {
        if (existsVideos[ytvideo_id]) {
            resolve(true);
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
                let exist = false;
                try {
                    exist = JSON.parse(obj).playabilityStatus.status == "OK";
                } catch (e) {}
                existsVideos[ytvideo_id] = exist;
                resolve(exist);
            });
        });
        yrequest.end();
    })
}