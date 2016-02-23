var FalcorServer = require('falcor-express'),
    bodyParser = require('body-parser'),
    express = require('express'),
    app = express(),
    NamesRouter = require('./router')

app.use(bodyParser.urlencoded({extended: false}));
app.use('/model.json', FalcorServer.dataSourceRoute(() => new NamesRouter()))
app.use(express.static('site'))
app.listen(9090, err => {
    if (err) {
        console.error(err)
        return
    }
    console.log('navigate to http://localhost:9090')
});
