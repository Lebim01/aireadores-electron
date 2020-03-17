import models from 'models'
import { statusNode, createEvent, eventIsRepeated } from 'helpers/connect-ssh'
import Swal from 'sweetalert2'
import { refreshNodesScreen } from 'helpers/emitters'
const { Op } = require('sequelize')

const setIntervalGlobal = require('electron').remote.getGlobal('setInterval')

export function monitor() {
    const getStatus = async () => {
        console.log('getStatus')
        try {
            const nodes = await models.node.findAll({
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
                    console.log('is error Network')
                    await createEvent(node, { node_status: node.status, action: 'GET STATUS', response: output, status: 'warning'})
                    continue
                }

                let node_statuses = [
                    {code: 10, name: 'detenido'},
                    {code: 11, name: 'horario'},
                    {code: 12, name: 'manual'},
                ]

                let status = node_statuses.find(status => response.data[0] === status.code )
                console.log(status)

                let is_manual_error_repeated = false
                if (!status || (node.status !== status.name)) {
                    let old_status = node.status

                    if(old_status === 'manual'){
                        console.log('error status in node: MANUAL')
                        let is_repeated = await eventIsRepeated(node.id, 'GET STATUS', 'manual', 'error')
                        if (is_repeated){
                            is_manual_error_repeated = true
                            console.log('is repeated...')
                        }
                        else{
                            console.log('is the first')
                        }
                    }

                    if(old_status === 'horario' || is_manual_error_repeated){
                        console.log('error!!!')
                        node.status = 'error';
                        await node.save();
                        // TODO: updates pages... Node.jxs and Nodes.jxs
                        refreshNodesScreen()
                    }
                    await createEvent(node, { node_status: old_status, action: 'GET STATUS', response: output, status: 'error'});
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
        await repeat()
    }

    repeat()
}

export default monitor