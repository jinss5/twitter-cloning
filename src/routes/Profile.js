import React, {useEffect} from "react";
import { authService, dbService } from "fbase";
import { useHistory } from "react-router-dom";

export default ({userObj}) => {
    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };
    const getMyTweets = async() => {
        const tweets = await dbService
            .collection("tweets")
            .where("creatorId", "==", userObj.uid)
            .orderBy("createdAt")
            .get();
    };
    useEffect(() => {
        getMyTweets();
    }, []);
    return (
        <>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};