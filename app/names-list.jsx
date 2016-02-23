var React = require('react'),
    Falcor = require('falcor'),
    model = require('./model.js');

class NamesList extends React.Component {
    constructor() {
        super()
        this.state = {names: {}}
    }

    componentWillMount() {
        this.update()
    }

    render() {
        console.log(this.state.names);
        var names = Falcor.keys(this.state.names).map(idx => {
            return <li key={idx}>{this.state.names[idx].name}</li>
        })
        return (
            <ul>{names}</ul>
        )
    }

    update() {
        model.getValue(['_view', 'length'])
            .then(length => model.get(['_view', {from: 0, to: length-1}, 'name']))
            .then(response => { 
                console.log(JSON.stringify(response.json, null, 4)); 
                this.setState({names: response.json._view})
            });
    }
}

module.exports = NamesList
