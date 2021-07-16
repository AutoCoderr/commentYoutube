import React,{useContext,useState,useEffect} from 'react';
import {SessionContext} from "../contexts/SessionContext";
import useQuery from "../services/useQuery";
import VideoService from "../services/VideoService";

function Watch() {
    const session = useContext(SessionContext);
    let YTVideoId = useQuery().get('v');
    if (YTVideoId.length > 11) {
        YTVideoId = YTVideoId.substring(0, 11);
        const newUrl = window.location.protocol+'//'+window.location.hostname+"/watch?v="+YTVideoId;
        window.history.pushState({path: newUrl},'',newUrl);
    }

    const [videoInfos,setVideoInfos] = useState(null)

    useEffect(() => {
        VideoService.getYTVideo(YTVideoId)
            .then(res => setVideoInfos(res))
    }, [])

    return (
        <div>
            {
                videoInfos &&
                <>
                    <h1>{videoInfos.title}</h1>
                    <iframe
                        style={{height: '500px', width: '70%'}}
                        src={"https://www.youtube.com/embed/"+YTVideoId}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                    <div>
                        <span>
                            {videoInfos.views} vues
                        </span>
                        <span>
                            <a target="_blank" href={"https://www.youtube.com/watch?v="+YTVideoId}>Vidéo sur youtube</a>
                        </span>
                        <span>
                            Chaine : <a target="_blank" href={"https://www.youtube.com/channel/"+videoInfos.channelId}>{videoInfos.author}</a>
                        </span>
                    </div>
                    <p>
                        {VideoService.computeDescription(videoInfos.description)}
                    </p>
                </>
            }
            {
                videoInfos === false &&
                <h1>Vidéo inexistante!</h1>
            }
        </div>
    )
}

export default Watch;