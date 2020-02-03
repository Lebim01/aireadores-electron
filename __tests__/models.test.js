import models from 'models/index'

jest.setTimeout(30 * 1000)

const attributes = [ 'id', 'address', 'channel', 'num', 'status', 'device_id', 'rssi', 'pool_id' ]

const someNodes = [
    {
        id: 1,
        address: '34.73.29.2',
        channel : '1234',
        num : 2,
        status : 'encendido',
        device_id : 2,
        rssi : 1,
        pool_id: 1
    },
    {
        id: 2,
        address: '34.73.29.2',
        channel : '9876',
        num : 6,
        status : 'encendido',
        device_id : 9,
        rssi : 10,
        pool_id: 2
    },
]

const somePools = [
    { name: 'Pool 1', id: 1 },
    { name: 'Pool 2', id: 2 },
]

const truncateAll = () => {
    return new Promise(async (resolve, reject) => {
        await models.node.destroy({ truncate: true })
        await models.pool.destroy({ truncate: true })
        resolve()
    })
}

const fillNodes = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await models.node.bulkCreate(someNodes)
            resolve()
        }catch(err){
            reject(err)
        }
    })
}

const fillPools = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await models.pool.bulkCreate(somePools)
            resolve()
        }catch(err){
            reject(err)
        }
    })
}

describe('Modelos', () => {
    describe('Nodos', () => {
        describe('Registros', () => {
            beforeEach(() => {
                return new Promise(async (resolve, reject) => {
                    await truncateAll()
                    await fillPools()
                    resolve()
                })
            })

            test('Debe insertar un nodo', async (done) => {
                await models.node.create(someNodes[0])
                const res = await models.node.findOne({ where: { id: someNodes[0].id }, attributes })
                expect(res.dataValues).toEqual(someNodes[0])
                done()
            })

            test('Debe fallar si no trae el campo {address}', async () => {
                expect.assertions(1);
                const { address, ...node } = someNodes[0]
                try {
                    await models.node.create(node)
                }catch(e){
                    expect(e.errors[0].message).toEqual('Dirección no puede ser vacio');
                }
            })
        })

        describe('Consultas', () => {
            beforeEach(() => {
                return new Promise(async (resolve) => {
                    await truncateAll()
                    await fillPools()
                    await fillNodes()
                    resolve()
                })
            })
    
            test('Debe consultar los nodos', async (done) => {
                let results = await models.node.findAll({ attributes })
                results = results.map(row => row.dataValues)
                expect(results).toEqual(someNodes)
                done()
            })
    
            test('Debe consultar el nodo con el id 1', async (done) => {
                const res = await models.node.findOne({ where: { id: 1 }, attributes })
                expect(res.dataValues).toEqual(someNodes[0])
                done()
            })
        })
    })
})