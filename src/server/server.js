const express = require("express");
const axios = require("axios");
const app = express();
const port = 3001; // You can choose a different port

const cors = require("cors");
app.use(cors());

async function checkIfEmbeddable(url) {
  try {
    const response = await axios.head(url, { timeout: 5000 }); // Menținem timeout-ul
    const xFrameOptions = response.headers["x-frame-options"];
    const contentSecurityPolicy = response.headers["content-security-policy"];

    // Verificăm restricțiile specifice prin antete, ignorând erorile de rețea
    if (
      xFrameOptions &&
      (xFrameOptions.toLowerCase().includes("deny") ||
        xFrameOptions.toLowerCase().includes("sameorigin"))
    ) {
      console.log("X-Frame-Options restricts embedding:", xFrameOptions);
      return false;
    }

    if (
      contentSecurityPolicy &&
      (contentSecurityPolicy.includes("frame-ancestors 'self'") ||
        contentSecurityPolicy.includes("frame-ancestors 'none'"))
    ) {
      console.log(
        "Content-Security-Policy restricts embedding:",
        contentSecurityPolicy
      );
      return false;
    }

    // Dacă nu sunt restricții specifice, considerăm URL-ul ca fiind încorporabil
    console.log("No obvious restrictions found.", url);
    return true;
  } catch (error) {
    console.error("Error checking headers or network issue:", error.message);
    // Ajustăm logica de tratament al erorilor pentru a permite unele cazuri specifice
    if (error.response) {
      // Dacă există un răspuns, chiar și unul de eroare, verificăm antetele
      const headers = error.response.headers;
      const xFrameOptions = headers["x-frame-options"];
      const contentSecurityPolicy = headers["content-security-policy"];
      if (
        xFrameOptions &&
        (xFrameOptions.toLowerCase().includes("deny") ||
          xFrameOptions.toLowerCase().includes("sameorigin"))
      ) {
        return false;
      }
      if (
        contentSecurityPolicy &&
        (contentSecurityPolicy.includes("frame-ancestors 'self'") ||
          contentSecurityPolicy.includes("frame-ancestors 'none'"))
      ) {
        return false;
      }
    }
    // Dacă eroarea este diferită de o problemă de rețea cunoscută, s-ar putea să dorim să permitem încorporarea
    return true;
  }
}

app.get("/proxy", async (req, res) => {
  const { urlTocheck } = req.query;

  const isValidURL = await checkIfEmbeddable(urlTocheck);
  console.log(isValidURL);
  if (urlTocheck && isValidURL) {
    return res.status(200).send();
  } else {
    // Display an error page or message
    return res.status(403).send("Invalid URL");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
