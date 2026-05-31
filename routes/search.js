const express = require('express');
const axios = require('axios');
const router = express.Router();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

router.get('/', async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ message: 'Paramètre "q" manquant' });
    }

    const { data } = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          key: YOUTUBE_API_KEY,
          part: 'snippet',
          q: query,
          maxResults: 10,
          type: 'video'
        }
      }
    );

    const videos = data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishTime
    }));

    res.json(videos);

  } catch (error) {
    console.error('Erreur API YouTube Search:', error.message);
    res.status(500).json({ message: 'Erreur lors de la recherche de vidéos' });
  }
});

module.exports = router;
