import React,{useState,useEffect} from 'react';
import useQuery from "../useQuery";
import VideoService from "../services/VideoService";
import {CommentProvider} from "../contexts/CommentContext";
import '../css/watch.css';
import Comments from "./comments/Comments";

function Watch() {
    const [descriptionCollapsed, setDescriptionCollapsed] = useState(true);


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
                    <div className="video-display">
                        <h1>{videoInfos.title}</h1>
                        <iframe
                            src={"https://www.youtube.com/embed/"+YTVideoId}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        <div className="video-infos">
                            <span>
                                { VideoService.formatViews(videoInfos.views)} vues
                            </span>
                            <span>
                                <a target="_blank" href={"https://www.youtube.com/watch?v="+YTVideoId}>Aller sur youtube</a>
                            </span>
                            <span>
                                Chaine : <a target="_blank" href={"https://www.youtube.com/channel/"+videoInfos.channelId}>{videoInfos.author}</a>
                            </span>
                        </div>
                        <div className="description">
                            <p className={descriptionCollapsed ? 'collapsed' : ''}>
                                {VideoService.computeDescription(videoInfos.description)}
                            </p>
                            <a className="show-description-button" onClick={() => setDescriptionCollapsed(!descriptionCollapsed)}>
                                {
                                    descriptionCollapsed ? 'PLUS' : 'MOINS'
                                }
                            </a>
                        </div>
                    </div>
                    <CommentProvider>
                        <Comments/>
                    </CommentProvider>
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