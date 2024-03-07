import React, { useContext, useCallback } from "react";
// import AuthContext from '../context/AuthContext'
import { endpoints } from "../utils/endpoints";
import { useNavigate } from "react-router-dom";
import storageComunicator from "../utils/storageComunication";
import GoogleLoginButton from "./GoogleLoginButton";

import { BrowserRouter as Router } from 'react-router-dom';
const Step1Login = () => {
  // let {loginUser} = useContext(AuthContext)
  const [incorrectPassword, setIncorrectPassword] = React.useState(false);
  const [incorrectEmail, setIncorrectEmail] = React.useState(false);

  const navigate = useNavigate();

  async function LogUserIn(event) {
    event.preventDefault();
    if (event.target.email.value === "") {
      setIncorrectEmail(true);
      return;
    } else setIncorrectEmail(false);
    if (event.target.password.value === "") {
      setIncorrectPassword(true);
      return;
    } else setIncorrectPassword(false);

    const response = await fetch(endpoints.login.basic.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: event.target.email.value,
        password: event.target.password.value,
      }),
    });
    console.log("response = ", response);
    let data = await response.json();
    console.log(data);
    if (data && response.status === 200) {
      storageComunicator.authToken.set(data);
      // setAuthTokens(data)
      // setUser(jwtDecode(data.access))
      navigate("/step3");
    } else {
      alert(data.detail);
    }
  }

  return (
    <div>
      <div className="mx-auto flex flex-col items-center justify-center w-full h-full">
        <div className="">
          <div>
            <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12">
              <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                  <div className="max-w-md mx-auto">
                    <div>
                      <h1 className="text-2xl font-semibold">Login</h1>
                    </div>
                    <form onSubmit={LogUserIn}>
                      <div className="divide-y classNamedivide-gray-200">
                        <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                          <div className="relative">
                            <input
                              requierd="true"
                              autoComplete="off"
                              id="email"
                              name="email"
                              type="text"
                              className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                              placeholder="email address"
                            />
                            <label
                              htmlFor="email"
                              className={`${
                                incorrectEmail === false ? "" : "text-red-400"
                              } absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm`}
                            >
                              Email Address
                            </label>
                          </div>
                          <div className="relative">
                            <input
                              requierd="true"
                              autoComplete="off"
                              id="password"
                              name="password"
                              type="password"
                              className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                              placeholder="password"
                            />
                            <label
                              htmlFor="password"
                              className={`${
                                incorrectPassword === false
                                  ? ""
                                  : "text-red-400"
                              } absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm`}
                            >
                              Password
                            </label>
                          </div>
                          <div className="relative flex items-center justify-end">
                            <button
                              type="submit"
                              className="bg-cyan-500 text-white rounded-md px-2 py-1"
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <GoogleLoginButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1Login;