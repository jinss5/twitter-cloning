import React, {useState, useEffect} from "react";
import { v4 as uuid4 } from "uuid"; //gives a random id
import {dbService, storageService} from "fbase";
import Tweet from "components/Tweet"

const Home = ({ userObj }) => {
    const [tweet, setTweet] = useState("");
    const [tweets, setTweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    /* non-Real time tweeting
    const getTweets = async () => {
        const dbTweets = await dbService.collection("tweets").get();
        dbTweets.forEach((document) => {
            const tweetObjects = {
                ...document.data(),
                id: document.id
            };
            setTweets((prev) => [tweetObjects, ...prev])
        })
    }*/

    //realtime tweeting
    useEffect(() => {
        //getTweets();
        dbService.collection("tweets").onSnapshot((snapshot) => {
            const tweetArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setTweets(tweetArray);
        });
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if (attachment !== "") { // if attachment exists
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuid4()}`)
            const response = await attachmentRef.putString(attachment, "data_url")
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const tweetObj = {
            text : tweet,
            createdAt: Date.now(),
            creatorID: userObj.uid, attachmentUrl
        }
        await dbService.collection("tweets").add(tweetObj);
        setTweet("");
        setAttachment("");
    };
    const onChange = (event) => {
        const {
            target:{value}
        } = event;
        setTweet(value);
    };
    const onFileChange = (event) => {
        const { target: { files } } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    }
    const onClearAttachment = () => setAttachment(null);
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={tweet} onChange={onChange} type="text" placeholder="what's in your mind?" maxLength={120}/>
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="Tweet"/>
                {attachment && (
                    <div>
                        <img src={attachment} alt="tweet" width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
            </form>
            <div>
                {tweets.map((tweet) => (
                    <Tweet
                        key={tweet.id}
                        tweetObj={tweet}
                        isOwner={tweet.creatorID === userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
}

export default Home;