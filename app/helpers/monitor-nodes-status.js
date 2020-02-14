import models from 'models'
import { statusNode } from 'helpers/connect-ssh'
import Swal from 'sweetalert2'

const emitter = require('electron').remote.getGlobal('setInterval')

export async function monitor() {
    try {
        const nodes = await models.node.findAll({ raw: true })
        for(let i in nodes){
            let node = nodes[i]
            let currentStatusNode = await statusNode(node.id)
            if(node.status !== currentStatusNode)
                Swal.fire(`Nodo con el indentificador #${node.device_id} cambio de estatus ${node.status} a ${currentStatusNode} inesperadamente`, '', 'error')
        }
    }
    catch(err){
        console.error(err)
    }
}

export default monitor