import React, { useEffect } from "react";

function GoogleSearch() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cse.google.com/cse.js?cx=a3a8ab065cac6490b";
    script.async = true;
    document.body.appendChild(script);

    window.onload = function () {
      const searchBox = document.querySelector("input.gsc-input");
      if (searchBox) {
        searchBox.placeholder = "Search the web...";
      }
    };
  }, []);

  return <div className="gcse-search"></div>;
}

export default GoogleSearch;
