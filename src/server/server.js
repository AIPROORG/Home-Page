const express = require("express");
const axios = require("axios");
const app = express();
const port = 3001; // You can choose a different port

const cors = require("cors");
app.use(cors());

async function checkIfEmbeddable(url) {
  try {
    const response = await axios.head(url);
    const xFrameOptions = response.headers["x-frame-options"];
    const contentSecurityPolicy = response.headers["content-security-policy"];

    if (xFrameOptions == null && contentSecurityPolicy == null) {
      console.log("No obvious restrictions found.", url);
      return true;
    }

    if (xFrameOptions && xFrameOptions.toLowerCase() === "sameorigin") {
      console.log("X-Frame-Options restricts embedding:", xFrameOptions);
      return false;
    }

    if (
      contentSecurityPolicy &&
      contentSecurityPolicy.includes("frame-ancestors 'self'")
    ) {
      console.log(
        "Content-Security-Policy restricts embedding:",
        contentSecurityPolicy
      );
      return false;
    }

    console.log("No obvious restrictions found.", url);
    return true;
  } catch (error) {
    console.error("Error checking headers:", error.message);
    return false;
  }
}

app.get("/proxy", async (req, res) => {
  const { urlTocheck } = req.query;

  const isValidURL = await checkIfEmbeddable(urlTocheck);
  // Validate the URL
  if (urlTocheck && isValidURL) {
    // Redirect to the URL
    return res.status(200).send();
  } else {
    // Display an error page or message
    return res.status(403).send("Invalid URL");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
