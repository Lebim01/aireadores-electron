import {Client} from 'ssh2'
import fs from 'fs'
import models from 'models'

export function connectToRasberry(){
    return new Promise(async (resolve, reject) => {
        try {
            const { dataValues: sshConfig } = await models.ssh.findOne({ where : { id : 1 } })

            if(!sshConfig) throw new Error('SSH Config is empty')
            if(!sshConfig.ip) throw new Error('SSH Config :: host es requerido')
            if(!sshConfig.port) throw new Error('SSH Config :: puerto es requerido')
            if(!sshConfig.username) throw new Error('SSH Config :: usuario es requerido')
            if(!sshConfig.key) throw new Error('SSH Config :: llave privada es requerida')

            const conn = new Client();

            conn.on('ready', function() {
                console.log('Client :: ready');
                resolve(conn)
            })

            conn.on('error', function(err){
                console.error('Client :: error', err)
                reject(err)
            })

            conn.connect({
                host: sshConfig.ip,
                port: sshConfig.port,
                username: sshConfig.username,
                privateKey: fs.readFileSync(sshConfig.key)
            });
        }catch(err){
            reject(err)
        }
    })
}

export function turnOnNode(node_id){
    return new Promise(async (resolve, reject) => {
        try {
            const conn = await connectToRasberry()

            const nodeInstance = await models.node.findByPk(node_id)
            
            if(!nodeInstance) throw new Error('Nodo no encontrado')

            const { 
                dataValues : {
                    address,
                    channel,
                    role,
                    num,
                    rssi
                }
            } = nodeInstance

            // comando que se ejecuta
            const shell = `echo 'comando shell' --address ${address} --channel ${channel} --role ${role} --num ${num} --rssi ${rssi}`
            // respuesta esperada para devolver positivo
            const compare = `comando shell`

            conn.exec(shell, function(err, stream){
                if (err)
                    throw err;
          
                stream.on('data', function(data) {
                    console.log('STDOUT::', data.toString())
                    if(data.toString().localeCompare(compare)){
                        resolve()
                    }else{
                        reject()
                    }
                    
                    stream.end()
                    conn.end()
                });
            })
        }
        catch(err){
            reject(err)
        }
    })
}