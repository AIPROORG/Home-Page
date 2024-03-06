import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
// import "./index.css";
import { endpoints } from "../utils/endpoints";
import storageComunicator from '../utils/storageComunication'

const SocialAuth = () => {
  let location = useLocation();
  const navigate = useNavigate();
  console.log(location);
  useEffect(() => {
    // console.log("location -------", location)
    const values = queryString.parse(location.search);
    const code = values.code ? values.code : null;
    if (code) {
      onGogglelogin();
    }
  }, []);

  const googleLoginHandler = (code) => {
    let url = `${endpoints.login.google}${code}`;
    return axios.post(url).then((res) => {
        // console.log("res from backend", res.data);
        storageComunicator.authToken.set(res.data);
        // localStorage.setItem("authTokens", JSON.stringify(res.data));
        navigate("/step3");
        return res.data;
      })
      .catch((err) => {
        console.log("error", err);
        return err;
      });
  };

  const onGogglelogin = async () => {
    googleLoginHandler(location.search);
    
  };

  return (
    <div className="loading-icon-container">
      <div className="loading-icon">
        <div className="loading-icon__circle loading-icon__circle--first"></div>
        <div className="loading-icon__circle loading-icon__circle--second"></div>
        <div className="loading-icon__circle loading-icon__circle--third"></div>
        <div className="loading-icon__circle loading-icon__circle--fourth"></div>
      </div>
      <small className=" text-center mr-2">Just a moment</small>
    </div>
  );
};

export default SocialAuth;
