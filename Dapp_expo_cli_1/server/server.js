const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port =process.env.PORT || 5000;
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.get('/api', function(req, res){
    res.json({username:'KIMYOHAN!!'})
});

app.listen(port, ()=>{
    console.log(`express is running on ${port}`);
})