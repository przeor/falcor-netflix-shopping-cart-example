var React = require('react'),
    model = require('./model.js');

class NameAdder extends React.Component {
    handleSubmit(event) {
        event.preventDefault()

        var input = this.refs.input

        model.
            call(
                ['_view', 'add'],
                [input.value],
                ["name"]
                ).
            then(() => {
                input.value = null
                input.focus()
                this.props.onAdded()
            })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <input ref="input"/>
                <button>add name</button>
            </form>
        )
    }
}

NameAdder.propTypes = {
    onAdded: React.PropTypes.func.isRequired
}

module.exports = NameAdder
