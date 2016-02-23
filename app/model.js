var Falcor = require('falcor'),
    FalcorDataSource = require('falcor-http-datasource'),
    model = new Falcor.Model({
        source: new FalcorDataSource('/model.json')
    })

module.exports = model