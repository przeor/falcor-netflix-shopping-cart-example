var React = require('react'),
    TestUtils = require('react/lib/ReactTestUtils'),
    NameManager = require('../name-manager.jsx')

describe('NameManager', () => {
    it('updates NamesList when new name is added', (done) => {
        class NameAdder extends React.Component {
            triggerOnAdded() {
                this.props.onAdded()
            }
            render() {return <div/>}
        }
        NameManager.__Rewire__('NameAdder', NameAdder)

        NameManager.__Rewire__('NamesList', class extends React.Component {
            update() {
                done()
            }
            render() {return <div/>}
        })

        var nameManager = TestUtils.renderIntoDocument(<NameManager/>)
        TestUtils.findRenderedComponentWithType(nameManager, NameAdder).triggerOnAdded()
    })
})
