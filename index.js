const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const server = require('http').createServer(app);

app.use(express.static(__dirname + '\\src'))

const link = [];

const scrape_url = async (query) => {
    const url = `https://www.pornhub.com/video/search?search=${query}`;

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        $('#videoSearchResult').each((i, e) => {
            $(e).children().each(async (i, e) => {
                let vkey = e.attribs['data-video-vkey'];
                link.push('https://www.pornhub.com/view_video.php?viewkey=' + vkey);
            });
        });

        return link[Math.floor(Math.random() * link.length)];
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};

app.get('/api', async (req, res) => {
    try {
        let query = req.query.search;
        const data = await scrape_url(query);
        res.json({
            url: data,
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/',(req,res)=>{
    res.sendFile('index.html')
})


server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
