const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const querystring = require("querystring");
const dotenv = require("dotenv");
const axios = require("axios");
const request = require("request");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client_id = process.env.CLIENT_ID;
const redirect_uri = "http://localhost:8080/callback";

function generateRandomString(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

// https://my-domain.com/callback?code=NApCCg..BkWtQ&state=34fFs29kd09
// https://my-domain.com/callback?error=access_denied&state=34fFs29kd09
app.get("/login", (req, res) => {
  const state = generateRandomString(16);
  const scope = "user-read-private user-read-email user-library-read playlist-modify-private playlist-modify-public user-top-read";

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

// https://my-domain.com/callback?code=NApCCg..BkWtQ&state=34fFs29kd09
// https://my-domain.com/callback?error=access_denied&state=34fFs29kd09
app.get("/callback", function (req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          new Buffer.from(client_id + ":" + process.env.CLIENT_SECRET).toString(
            "base64"
          ),
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        var refresh_token = body.refresh_token;

        console.log(access_token);
        console.log(refresh_token);

        res.json({
          access_token: access_token,
          refresh_token: refresh_token,
        });
      } else {
        res.json({
          msg: "invalid token",
        });
      }
    });
  }
});


app.get("/me", async(req, res) => {
  const access_token = await req.body.token;

  try {
    const ress = await axios.get(
      "https://api.spotify.com/v1/me",
      {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      },
    );
    const data = await ress.data;

    res.status(200).json({
      msg: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "data retrival unssessfull",
    });
  }
});

app.get("/me/tracks", async(req, res)=>{
    const access_token = await req.body.token;

    try {
        const ress = await axios.get(
          "https://api.spotify.com/v1/me/top/artists",
          {
            headers: {
              Authorization: "Bearer " + access_token,
            },
          },
        );
        const data = await ress.data;
    
        res.json({
          msg: data,
        });
      } catch (error) {
        console.log(error);
        res.json({
          msg: "data retrival unssessfull",
        });
      }
})

app.get("/me/following", async(req, res)=>{
    const access_token = await req.body.token;

    try {
        const ress = await axios.get(
          "https://api.spotify.com/v1/me/following?type=artist",
          {
            headers: {
              Authorization: "Bearer " + access_token,
            },
          },
        );
        const data = await ress.data;
    
        res.json({
          msg: data,
        });
      } catch (error) {
        console.log(error);
        res.json({
          msg: "data retrival unssessfull",
        });
      }
})

app.get("/tracks", async(req, res)=>{
    const access_token = await req.body.token;

    try {
        const ress = await axios.get(
          "https://api.spotify.com/v1/tracks",
          {
            headers: {
              Authorization: "Bearer " + access_token,
            },
          },
        );
        const data = await ress.data;
    
        res.json({
          msg: data,
        });
      } catch (error) {
        console.log(error);
        res.json({
          msg: "data retrival unssessfull",
        });
      }
})

app.get("/tracks", async(req, res)=>{
    const access_token = await req.body.token;

    try {
        const ress = await axios.get(
          "https://api.spotify.com/v1/recommendations",
          {
            headers: {
              Authorization: "Bearer " + access_token,
            },
          },
        );
        const data = await ress.data;
    
        res.json({
          msg: data,
        });
      } catch (error) {
        console.log(error);
        res.json({
          msg: "data retrival unssessfull",
        });
      }
})

// http://localhost:5173/callback?code=AQBbTMQC2AeQ3cqm8Ytgx6OoJVAfhWXEWMGKOJxSXye9zjpJO7X47Rc4YC0zz_MIM-fywVN84isK7JyGWSM-6jodiaUyc9wBVFerbhsNDsNyMnuo7mG_bPQ6S_gYzj7fu_GTSUM46WttmocJ0utKKq2pLtWHLpLobjVE2IIxbVfntBxNwUn6bdeKh4E9JmbaXgCpjf2PtAcDy_lwurd4QDf40gHh8A&state=842f01fb4ec27c98
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("server listens at: ", PORT);
});