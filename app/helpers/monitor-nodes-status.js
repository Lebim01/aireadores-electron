import models from 'models'
import { statusNode } from 'helpers/connect-ssh'
import Swal from 'sweetalert2'

const setIntervalGlobal = require('electron').remote.getGlobal('setInterval')

export function monitor() {
    const getStatus = async () => {
        console.log('getStatus')
        try {
            const nodes = await models.node.findAll({ raw: true })
            for(let i in nodes){
                console.log('nodo')
                let node = nodes[i]
                console.log(node)
                let currentStatusNode = await statusNode(node.id)
                console.log('currentStatusNode', currentStatusNode)
                //if(node.status !== currentStatusNode)
                //    Swal.fire(`Nodo con el indentificador #${node.device_id} cambio de estatus ${node.status} a ${currentStatusNode} inesperadamente`, '', 'error')
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
        await wait(15)
        repeat()
    }

    repeat()
}

export default monitor