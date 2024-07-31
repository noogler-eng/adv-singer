const express = require("express");

const general_route = express.Router();
const axios = require("axios");

general_route.get('/search_artist', async(req, res)=>{
    const {artist, access_token} = await req.body;
    try{

        const response_1 = await axios.get(`https://api.spotify.com/v1/search?q=remaster%2520track%3ADoxy%2520artist%3A${artist}&type=artist&limit=1`, {
            headers: {
                Authorization: "Bearer " + access_token,
            },
        })
        const artist_data = await response_1.data;
        const artist_id = artist_data.artists.items[0].id;

        const response = await axios.get(`https://api.spotify.com/v1/artists/${artist_id}/top-tracks`, {
            headers: {
                Authorization: "Bearer " + access_token,
            },
        })
        const data = await response.data;

        res.json({
            artist: artist_data,
            msg: data
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            msg: error
        })
    }
})

general_route.get('/search_track', async(req, res)=>{
    const {track, access_token} = await req.body;
    try{

        const response_1 = await axios.get(`https://api.spotify.com/v1/search?q=remaster%2520track%3A${track}&type=track`, {
            headers: {
                Authorization: "Bearer " + access_token,
            },
        })
        const data = await response_1.data;

        res.json({
            msg: data
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            msg: error
        })
    }
})

module.exports = { general_route };