var React = require('react'),
    TestUtils = require('react/lib/ReactTestUtils'),
    NamesList = require('../names-list.jsx'),
    Falcor = require('falcor')

describe('NamesList', () => {
    afterEach(() => NamesList.__ResetDependency__('model'))

    it('renders with some initial data', (done) => {
        NamesList.__Rewire__('model', new Falcor.Model({
            cache: {
                names: {
                    0: {name: 'joe'},
                    1: {name: 'jane'},
                    length: 2
                }
            }
        }))

        var namesList = TestUtils.renderIntoDocument(<NamesList/>)

        namesList.componentDidUpdate = () => {
            var nameEls = TestUtils.scryRenderedDOMComponentsWithTag(namesList, 'li')

            expect(nameEls.length).toBe(2)
            expect(nameEls[0].textContent).toBe('joe')
            expect(nameEls[1].textContent).toBe('jane')

            done()
        }
    })
})
