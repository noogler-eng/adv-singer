const express = require("express");
const crypto = require("crypto");
const querystring = require("querystring");
const request = require("request");
const dotenv = require("dotenv");
dotenv.config();

const token_route = express.Router();

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
token_route.get('/login', (req, res)=>{
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
    }));
})

token_route.get("/callback", function (req, res) {
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

module.exports = { token_route };