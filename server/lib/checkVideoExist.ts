import https from "https";

export default function checkVideoExist(yvideo_id) {
    return new Promise(resolve => {
        const yrequest = https.request({
            host: 'www.youtube.com',
            path: '/watch?v='+yvideo_id
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
                resolve(JSON.parse(obj).playabilityStatus.status == "OK");
            });
        });
        yrequest.end();
    })
}