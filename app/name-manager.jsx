var React = require('react'),
    NameAdder = require('./name-adder.jsx'),
    NamesList = require('./names-list.jsx');

module.exports = class extends React.Component {
    handleNameAdded() {
        this.refs.namesList.update()
    }

    render() {
        return (
            <div>
                <NameAdder onAdded={this.handleNameAdded.bind(this)}/>
                <NamesList ref="namesList"/>
            </div>
        )
    }
}
