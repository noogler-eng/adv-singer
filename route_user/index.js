const express = require("express");

const user_route = express.Router();
const axios = require("axios");


// getting user profile
user_route.get("/me", async(req, res)=>{
    const access_token = await req.headers.authorization;

    try{
        const response = await axios.get(
          "https://api.spotify.com/v1/me", {
            headers: {
              Authorization: "Bearer " + access_token,
            },
          },
        );
        const data = await response.data;
    
        res.json({ msg: data });
    }catch (error) {
        console.log(error);
        res.status(500).json({ msg: "data retrival unssessfull" });
    }
})

// getting user all top tracks where limit is 10
user_route.get("me/tracks", async(req, res)=>{
    const access_token = req.body.access_token;
    
    try{
        const response = await axios.get(
          "https://api.spotify.com/v1/me/top/tracks", {
            headers: {
              Authorization: "Bearer " + access_token,
            },
          },
        );
        const data = await response.data;
    
        res.json({ msg: data });
    }catch (error) {
        console.log(error);
        res.status(500).json({ msg: "data retrival unssessfull" });
    }
})

// getting user all top artists where limit is 10
user_route.get("/me/artists", async(req, res)=>{
    const access_token = req.body.access_token;
    
    try{
        const response = await axios.get(
          "https://api.spotify.com/v1/me/top/artists", {
            headers: {
              Authorization: "Bearer " + access_token,
            },
          },
        );
        const data = await response.data;
    
        res.json({ msg: data });
    }catch (error) {
        console.log(error);
        res.status(500).json({ msg: "data retrival unssessfull" });
    }
})  

// getting user follower of artists
user_route.get("/me/follower", async(req, res)=>{
  const access_token = await req.headers.authorization;
  
  if (!access_token) {
    return res.status(401).json({ msg: "No access token provided" });
  }
  
  try{
      const response = await axios.get("https://api.spotify.com/v1/me/following?type=artist", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      const data = await response.data;
  
      res.json({ msg: data });
  }catch (error) {
      console.log(error);
      res.status(500).json({ msg: "data retrival unssessfull" });
  }
})

// getting user's all playlist
user_route.get("/me/playlists", async(req, res)=>{
  const access_token = await req.headers.authorization;    

    try{
        const response = await axios.get(
          "https://api.spotify.com/v1/me/playlists", {
            headers: {
              Authorization: "Bearer " + access_token,
            },
          },
        );
        const data = await response.data;

        const newData = await Promise.all(data.items.map(async(playlist)=>{
          const responsePlaylists = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlist.id}`, {
              headers: {
                Authorization: "Bearer " + access_token,
              },
            },
          );
          return responsePlaylists.data;
        }))

        res.json({ msg: newData });
    }catch (error) {
        console.log(error);
        res.status(500).json({ msg: "data retrival unssessfull" });
    }
})


module.exports = { user_route };