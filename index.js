const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const port = 3000;

const QRCode = require("qrcode");

const Store = require('./store');

app.use('/static', express.static('static'));
app.use(express.json())

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

router.get('/read', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/read.html'));
});

router.post('/check',async (req,res)=>{
    if(req.body.id){
        let id = req.body.id;
        id = encodeURIComponent(id);
        console.log('id',id);
        let data = await Store.getFromCollection('randevu',id);
        res.send(data);
    }
});

router.get('/list',async (req,res)=>{
    let items = await Store.listCollection('randevu');
    res.send(items);
})

router.post('/create',async (req,res)=>{
    if(req.body.data){
        let data = req.body.data;
        let ref = await Store.addToCollection('randevu',data);
        QRCode.toDataURL(ref.id, async (err, url) => {
            data.qr = url;
            await Store.updateToCollection('randevu',ref.id,data);
            data.id = ref.id;
            res.send(data);
        })
    }
});

router.post('/remove',async (req,res)=>{
    if(req.body.id)
    {
        let id = req.body.id;
        await Store.removeFromCollection('randevu',id);
        res.send();
    }
})

router.post('/generate', (req, res) => {
    QRCode.toDataURL(req.body.data, (err, url) => {
        res.send(url);
    })
}
);

router.get('/show', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/show.html'))
})

app.use('/', router);

app.listen(port, () => console.log('app listening at 3000 port'));