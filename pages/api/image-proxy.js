import axios from 'axios';

async function imageProxy(req, res) {
    const { url } = req.query;

    if (!url) {
      return res.status(400).send('URL is required');
    }
  
    try {
      const imageRes = await axios.get(url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(imageRes.data, 'binary');
  
      res.setHeader('Content-Type', imageRes.headers['content-type']);
      res.send(buffer);
    } catch (error) {
      res.status(500).send('Error fetching image');
    }
}

export default imageProxy;
