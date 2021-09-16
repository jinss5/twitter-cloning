import React, {useState, useEffect} from "react";
import AppRouter from "components/Router"
import { authService } from "fbase";

function App() {
  // react hook is used below
  // Declare a new state variable, which we'll call "isLoggedIn"
  // here, "useState" is a hook. It is called inside a function component to add some local state to it.
  const [init, setInit] = useState(false);
  //const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
        if(user){
            //setIsLoggedIn(true);
            setUserObj({
                displayName: user.displayName,
                uid: user.uid,
                updateProfile: (args) => user.updateProfile(args),
            });
        //} else {
        //    setIsLoggedIn(false);
        }
        setInit(true);
    });
  }, []);
    const refreshUser = () => {
        const user = authService.currentUser;
        setUserObj({
            displayName: user.displayName,
            uid: user.uid,
            updateProfile: (args) => user.updateProfile(args),
        });
    };
  return (
      <>
          {init ? (
              <AppRouter
                  refreshUser={refreshUser}
                  isLoggedIn={Boolean(userObj)}
                  userObj={userObj}
              />
          ) : (
              "Initializing..."
          )}
        <footer>&copy; {new Date().getFullYear()} Twitter</footer>
      </>
    );
}

export default App;
