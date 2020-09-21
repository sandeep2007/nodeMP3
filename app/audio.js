const cors = require('cors')
const express = require('express')
const router = express.Router()
const MP3Cutter = require('mp3-cutter');
const url = require('url');
const os = require('os')
const homedir = os.homedir();
const jsmediatags = require("jsmediatags");
const Window = require('window');
const window = new Window();
const fs = require('fs')

router.get('/', async (req, res) => {
    try {

        res.status(200).json({
            message: 'audio api'
        })
    }
    catch (err) {
        res.status(403).json({ message: err });
    }
})

router.get('/info', async (req, res) => {
    const adr = req.protocol + '//' + req.get('host') + req.originalUrl
    const q = url.parse(adr, true);
    let data = {}
    try {
        jsmediatags.read(homedir + '/public_html/' + q.query.path + q.query.file, {
            onSuccess: function (tag) {
                //console.log(tag);
                var image = tag.tags.picture;
                data.title = tag.tags.title;
                data.artist = tag.tags.artist;
                data.album = tag.tags.album;

                if (image) {
                    var base64String = "";
                    for (var i = 0; i < image.data.length; i++) {
                        base64String += String.fromCharCode(image.data[i]);
                    }
                    //var base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
                    //var base64 = (base64String);
                    // document.getElementById('picture').setAttribute('src', base64);

                    data.imageData = 'https://121directory.com/data/bollala/music/image/' + (q.query.file).replace('.mp3', '') + '.png'
                    fs.writeFile(homedir + '/public_html/' + q.query.path + '/image/' + (q.query.file).replace('.mp3', '') + '.png', window.btoa(base64String), { encoding: 'base64' }, function (err) {
                        //console.log('File created');
                    });
                } else {
                    data.imageData = null
                }
                res.status(200).json(data)
            },
            onError: function (error) {
                // console.log(':(', error.type, error.info);
                data.type = error.type
                data.info = error.info
                res.status(403).json(data)
            }
        });

    }
    catch (err) {
        res.status(403).json({ message: err });
    }
})

router.get('/cut', async (req, res) => {
    const adr = req.protocol + '//' + req.get('host') + req.originalUrl
    const q = url.parse(adr, true);
    try {
        MP3Cutter.cut({
            src: homedir + '/public_html/' + q.query.path + q.query.file,
            target: homedir + '/public_html/' + q.query.path + q.query.file,
            start: q.query.start,
            end: q.query.end
        });
        res.status(200).json({
            status: true,
            start: q.query.start,
            end: q.query.end,
            path: q.query.path,
            file: q.query.file,
            duration: (q.query.end - q.query.start)
        })
    }
    catch (err) {
        res.status(403).json({ message: 'Something went wrong' });
    }
})

module.exports = router