import React, {useState, useEffect} from "react";
import {dbService} from "fbase";
import Tweet from "components/Tweet"

const Home = ({ userObj }) => {
    const [tweet, setTweet] = useState("");
    const [tweets, setTweets] = useState([]);
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
        await dbService.collection("tweets").add({
            text : tweet,
            createdAt: Date.now(),
            creatorID: userObj.uid
        });
        setTweet("");
    };
    const onChange = (event) => {
        const {
            target:{value}
        } = event;
        setTweet(value);
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={tweet} onChange={onChange} type="text" placeholder="what's in your mind?" maxLength={120}/>
                <input type="submit" value="Tweet"/>
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