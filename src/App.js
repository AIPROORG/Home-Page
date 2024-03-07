import { useEffect } from "react";
import React from "react";
import MainPage from "./pages/MainPage";
import storageComunicator from "./utils/storageComunication";
import {endpoints} from "./utils/endpoints";

const App = () => {

  // useEffect(()=>{
  //   let authTokens = storageComunicator.authToken.get()
    
  //   const REFRESH_INTERVAL = 1000 * 60 * 4 // 4 minutes
  //   let interval = setInterval(()=>{
  //     console.log("interval for refresh token")
  //       if(authTokens){
  //           updateToken()
  //       }
  //   }, REFRESH_INTERVAL)
  //   return () => clearInterval(interval)

  // },[])


  // const updateToken = async () => {
  //   const authTokens = storageComunicator.authToken.get()
  //   if(!authTokens?.refresh) return
  //   const response = await fetch(endpoints.login.basic.updateToken, {
  //       method: 'POST',
  //       headers: {
  //           'Content-Type':'application/json'
  //       },
  //       body:JSON.stringify({refresh:authTokens?.refresh})
  //   })
  
  //   const data = await response.json()
  //   if (response.status === 200) {
  //       storageComunicator.authToken.set(data)
  //   } else {
  //         localStorage.removeItem('authTokens')
  //   }
  // }


  return <MainPage />;
};

export default App;