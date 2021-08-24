import {useState,useCallback} from "react";
import { useHistory } from "react-router-dom";

export default function Index() {
	const [YTurl,setYTUrl] = useState("");
	const [incorrectRegex,setIncorrectRegex] = useState(false);

	const regexYoutubeLink = new RegExp("^(http(s)?://)?((www|m)\\.)?youtube.com/watch\\?v=[a-zA-Z0-9]{11}$");
	const regexGetVideoId = new RegExp("v=[a-zA-Z0-9]{11}");

	const history = useHistory();

	const handleYTURL = useCallback(
		(e) => setYTUrl(e.target.value) | setIncorrectRegex(false),
		[]
	)

	const goToYTVideo = useCallback(
		() => !regexYoutubeLink.test(YTurl) ?
			setIncorrectRegex(true) :
			(() => {
				const videoId = YTurl.match(regexGetVideoId)[0].split("=")[1];
				history.push("/watch?v="+videoId);
			})(),
		[YTurl]
	)

	const onKeyUp = useCallback(
		(e) => e.code === "Enter" && goToYTVideo(),
		[YTurl]
	)

	return (
		<div>
			<label>Rentrez l'url d'une vidéo youtube :</label>
			<input onKeyUp={onKeyUp} value={YTurl} onChange={handleYTURL} type="text" placeholder="ex : https://www.youtube.com/watch?v=12345678912"/>
			<a className="go_button" onClick={goToYTVideo}>GO</a>
			{
				incorrectRegex &&
				<div className="error">
					Lien incorrect
				</div>
			}
		</div>
	);
}
