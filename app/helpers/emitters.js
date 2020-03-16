const emitter = require('electron').remote.getGlobal('sequelize-emitter')

/**
 * Refresh Node and Nodes
 */
export function refreshNodesScreen(){
    emitter.emit('node-refresh')
}