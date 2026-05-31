const express = require('express');
const axios = require('axios');
const router = express.Router();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

router.get('/', async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(400).json({ message: "Missing id" });
    }

    const { data } = await axios.get(
      'https://www.googleapis.com/youtube/v3/videos',
      {
        params: {
          key: YOUTUBE_API_KEY,
          part: 'snippet,statistics',
          id: id
        }
      }
    );

    if (!data.items.length) {
      return res.status(404).json({ message: "Video not found" });
    }

    const item = data.items[0];

    const video = {
      id: item.id,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      views: item.statistics.viewCount,
      thumbnail: item.snippet.thumbnails.medium.url
    };

    res.json(video);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error fetching video" });
  }
});

module.exports = router;
