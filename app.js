require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
  res.render('homepage')
})

app.get('/artist-search', (req, res) => {
  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    const artists = data.body.artists.items
    console.log(artists)
    res.render('artist-search-results',{artists})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res) => {
  const id = req.params
  console.log(id.artistId)
  spotifyApi
  .getArtistAlbums(id.artistId)
  .then( data => {
    const albums = data.body.items
    console.log(albums);
    res.render('albums',{albums})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/tracks/:artistId',(req,res) => {
  spotifyApi.getAlbumTracks(req.params.artistId)
  .then(data => {
    const tracks = data.body.items
    res.render('tracks',{tracks})
  })
  .catch(err => console.log('The error while searching tracks occurred: ', err));
});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));