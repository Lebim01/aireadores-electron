import models from 'models/index'

describe('Modelos', () => {
    describe('Nodos', () => {
        test('Debe consultar los nodos', (done) => {
            models.node.findAll()
            .then((results) => {
                expect(results).toBeDefined()
            })
        })
    })
})