import React, {useState, useEffect, useContext, useCallback} from 'react';
import useQuery from "../useQuery";
import VideoService from "../services/VideoService";
import {CommentProvider} from "../contexts/CommentContext";
import '../css/watch.css';
import Comments from "./comments/Comments";
import FormatService from "../services/FormatService";
import {SessionContext} from "../contexts/SessionContext";
import likeImg from "../images/like.png";
import dislikeImg from "../images/dislike.png";

function Watch() {
    const [descriptionCollapsed, setDescriptionCollapsed] = useState(true);
    const {session} = useContext(SessionContext);


    let YTVideoId = useQuery().get('v');
    if (YTVideoId.length > 11) {
        YTVideoId = YTVideoId.substring(0, 11);
        const newUrl = window.location.protocol+'//'+window.location.hostname+"/watch?v="+YTVideoId;
        window.history.pushState({path: newUrl},'',newUrl);
    }

    const [videoInfos,setVideoInfos] = useState(null)

    useEffect(() => {
        if (session != null) {
            VideoService.getYTVideo(YTVideoId)
                .then(res => setVideoInfos(res))
        }
    }, [session])

    const reactOneVideo = useCallback(
        (type) => videoInfos && VideoService[type+'Video'](YTVideoId).then(() => {
            const antiType = type === 'like' ? 'dislike' : 'like';
            setVideoInfos({
                ...videoInfos,
                [type+'d']: !videoInfos[type+'d'],
                [type+'s']: videoInfos[type+'d'] ? videoInfos[type+'s']-1 : videoInfos[type+'s']+1,
                [antiType+'d']: false,
                [antiType+'s']: videoInfos[antiType+'d'] ? videoInfos[antiType+'s']-1 : videoInfos[antiType+'s']
            })
        }),
        [videoInfos]
    )

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
                                { FormatService.formatViews(videoInfos.views)} vues
                            </span>
                            <div className="likes_and_dislikes">
                                <span onClick={() => reactOneVideo('like')}>
                                    <img className={videoInfos.liked ? 'reacted' : ''} src={likeImg}/>
                                        {videoInfos.likes}
                                    </span>
                                <span onClick={() => reactOneVideo('dislike')}>
                                    <img className={videoInfos.disliked ? 'reacted' : ''} src={dislikeImg}/>
                                    {videoInfos.dislikes}
                                </span>
                            </div>
                            <span>
                                <a target="_blank" href={"https://www.youtube.com/watch?v="+YTVideoId}>Aller sur youtube</a>
                            </span>
                            <span>
                                Chaine : <a target="_blank" href={"https://www.youtube.com/channel/"+videoInfos.channelId}>{videoInfos.author}</a>
                            </span>
                        </div>
                        <div className="description">
                            <p className={descriptionCollapsed ? 'collapsed' : ''}>
                                {FormatService.computeMessage(videoInfos.description)}
                            </p>
                            {
                                videoInfos.description.split("\n").length >= 4 &&
                                    <a className="show-description-button" onClick={() => setDescriptionCollapsed(!descriptionCollapsed)}>
                                        {
                                            descriptionCollapsed ? 'PLUS' : 'MOINS'
                                        }
                                    </a>
                            }
                        </div>
                    </div>
                    <CommentProvider session={session}>
                        <Comments/>
                    </CommentProvider>
                </>
            }
            {
                videoInfos === false &&
                <h1>Vid??o inexistante!</h1>
            }
        </div>
    )
}

export default Watch;
