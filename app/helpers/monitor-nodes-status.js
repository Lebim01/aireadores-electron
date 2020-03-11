import models from 'models'
import { statusNode, createEvent } from 'helpers/connect-ssh'
import Swal from 'sweetalert2'
const { Op } = require('sequelize')

const setIntervalGlobal = require('electron').remote.getGlobal('setInterval')

export function monitor() {
    const getStatus = async () => {
        console.log('getStatus')
        try {
            const nodes = await models.node.findAll({
                raw: true,
                where: {
                    status: {
                        [Op.notIn]: ['detenido', 'error', 'desactivado'],
                    }
                }
            })
            for(let i in nodes){
                console.log('nodo')
                let node = nodes[i]
                console.log(node)
                let output = await statusNode(node.id)
                let response = JSON.parse(output.split('\n')[0])

                console.log(response)

                if (response.status == 'ERROR_NETWORK') {
                    createEvent(node, { node_status: node.status, action: 'GET STATUS', response: output, status: 'warning'})
                    continue
                }

                let node_statuses = [
                    {code: 10, name: 'detenido'},
                    {code: 11, name: 'horario'},
                    {code: 12, name: 'manual'},
                ]

                let status = node_statuses.find(status => response.data[0] === status.code )

                console.log(status)

                if (!status || (node.status !== status.name)) {
                    createEvent(node, { node_status: node.status, action: 'GET STATUS', response: output, status: 'error'})
                }
            }
        }
        catch(err){
            console.error('Error', err)
        }
    }

    const wait = (sec) => {
        return new Promise((resolve) => {
            setTimeout(resolve, sec * 1000)
        })
    }

    const repeat = async () => {
        await getStatus()
        await wait(60 * 5)
        repeat()
    }

    repeat()
}

export default monitor