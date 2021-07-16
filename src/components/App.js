import React, {useState, useEffect} from "react";
import AppRouter from "components/Router"
import { authService } from "fbase";

function App() {
  // react hook is used below
  // Declare a new state variable, which we'll call "isLoggedIn"
  // here, "useState" is a hook. It is called inside a function component to add some local state to it.
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
        if(user){
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
        setInit(true);
    });
  }, []);
  return (
      <>
          {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Initializing..."}
        <footer>&copy; {new Date().getFullYear()} Jwitter</footer>
      </>
    );
};

export default App;
