import React, { useEffect } from "react";

function GoogleSearch() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cse.google.com/cse.js?cx=a3a8ab065cac6490b";
    script.async = true;

    // Correct way to add an onload event listener
    script.onload = () => {
      const searchBox = document.querySelector("input.gsc-input");
      if (searchBox) {
        searchBox.placeholder = "Search the web...";
      }
    };

    // Append script to the body
    document.body.appendChild(script);

    // Cleanup function to remove the script
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div className="gcse-search"></div>;
}

export default GoogleSearch;
