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
                privateKey: fs.readFileSync(sshConfig.key),
                passphrase: sshConfig.passphrase || null,
            });
        }catch(err){
            reject(err)
        }
    })
}

export function connectToNode(node_id){
    return new Promise(async (resolve, reject) => {
        try {
            const conn = await connectToRasberry()

            const nodeInstance = await models.node.findByPk(node_id)
            
            if(!nodeInstance) throw new Error('Nodo no encontrado')

            const { 
                dataValues : {
                    address,
                    channel,
                    device_id,
                    role,
                    num,
                }
            } = nodeInstance

            resolve({
                conn, 
                node : {
                    address,
                    channel,
                    device_id,
                    role: 0,  // TODO get it from frontend
                    num,
                }
            })
        }
        catch(err){
            reject(err)
        }
    })
}

export function enableProgramNode(node_id){
    return new Promise(async (resolve, reject) => {
        try {
            const { conn, node } = await connectToNode(node_id)

            // comando que se ejecuta
            const shell = `./aireadores-server/aircontrol.py run_schedule ${node.address} ${node.channel} ${node.device_id} ${node.role} ${node.num}`

            console.log(shell)

            // respuesta esperada para devolver positivo
            const compare = `comando shell`

            conn.exec(shell, function(err, stream){
                if (err)
                    throw err;
        
                stream.on('data', function(data) {
                    console.log('STDOUT::', data.toString())
                    if(data.toString().localeCompare(compare)){
                        resolve(data.toString())
                    }else{
                        reject('Respuesta no esperada')
                    }
                    
                    stream.end()
                    conn.end()
                }).stderr.on('data', function(data) {
                    reject(data.toString())
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

export async function turnOnNode(node_id, time, num){
    return new Promise(async (resolve, reject) => {
        try {
            const { conn, node } = await connectToNode(node_id)

            // comando que se ejecuta
            const shell = `./aireadores-server/aircontrol.py run_timer ${node.address} ${node.channel} ${node.device_id} ${node.role} ${num} ${time}`
            console.log(shell)
            // respuesta esperada para devolver positivo
            const compare = `comando shell`

            conn.exec(shell, function(err, stream){
                if (err)
                    throw err;
        
                stream.on('data', function(data) {
                    console.log('STDOUT::', data.toString())
                    if(data.toString().localeCompare(compare)){
                        resolve(data.toString())
                    }else{
                        reject('Respuesta no esperada')
                    }
                    
                    stream.end()
                    conn.end()
                }).stderr.on('data', function(data) {
                    reject(data.toString())
                    stream.end()
                    conn.end()
                });
            })
        }catch(err){
            reject(err)
        }
    })
}

export function turnOffNode(node_id){
    return new Promise(async (resolve, reject) => {
        try {
            const { conn, node } = await connectToNode(node_id)

            // comando que se ejecuta
            const shell = `echo apagar --address ${node.address} --channel ${node.channel} --role ${node.role} --num ${node.num} --rssi ${node.rssi}`
            console.log(shell)
            // respuesta esperada para devolver positivo
            const compare = `comando shell`

            conn.exec(shell, function(err, stream){
                if (err)
                    throw err;
        
                stream.on('data', function(data) {
                    console.log('STDOUT::', data.toString())
                    if(data.toString().localeCompare(compare)){
                        resolve(data.toString())
                    }else{
                        reject('Respuesta no esperada')
                    }
                    
                    stream.end()
                    conn.end()
                }).stderr.on('data', function(data) {
                    reject(data.toString())
                    stream.end()
                    conn.end()
                });
            })
        }catch(err){
            reject(err)
        }
    })
}

export function enableNode(node_id){
    return new Promise(async (resolve, reject) => {
        try {
            const { conn, node } = await connectToNode(node_id)

            // comando que se ejecuta
            const shell = `echo programar --address ${node.address} --channel ${node.channel} --role ${node.role} --num ${node.num} --rssi ${node.rssi}`
            console.log(shell)
            // respuesta esperada para devolver positivo
            const compare = `comando shell`

            conn.exec(shell, function(err, stream){
                if (err)
                    throw err;
        
                stream.on('data', function(data) {
                    console.log('STDOUT::', data.toString())
                    if(data.toString().localeCompare(compare)){
                        resolve(data.toString())
                    }else{
                        reject('Respuesta no esperada')
                    }
                    
                    stream.end()
                    conn.end()
                }).stderr.on('data', function(data) {
                    reject(data.toString())
                    stream.end()
                    conn.end()
                });
            })
        }catch(err){
            reject(err)
        }
    })
}

export function disableNode(node_id){
    return new Promise(async (resolve, reject) => {
        try {
            const { conn, node } = await connectToNode(node_id)

            // comando que se ejecuta
            const shell = `./aireadores-server/aircontrol.py stop ${node.address} ${node.channel} ${node.device_id} ${node.role} 12`

            console.log(shell)

            // respuesta esperada para devolver positivo
            const compare = `comando shell`

            conn.exec(shell, function(err, stream){
                if (err)
                    throw err;
        
                stream.on('data', function(data) {
                    console.log('STDOUT::', data.toString())
                    if(data.toString().localeCompare(compare)){
                        resolve(data.toString())
                    }else{
                        reject('Respuesta no esperada')
                    }
                    
                    stream.end()
                    conn.end()
                }).stderr.on('data', function(data) {
                    reject(data.toString())
                    stream.end()
                    conn.end()
                });
            })
        }catch(err){
            reject(err)
        }
    })
}

export function pingNode(node_id){
    return new Promise(async (resolve, reject) => {
        try {
            const { conn, node } = await connectToNode(node_id)

            // comando que se ejecuta
            const shell = `./aireadores-server/aircontrol.py ping ${node.address} ${node.channel} ${node.device_id} ${node.role}`
            // respuesta esperada para devolver positivo
            const compare = `comando shell`

            conn.exec(shell, function(err, stream){
                if (err)
                    reject(err);

                stream
                .on('data', function(data) {
                    console.log('STDOUT::', data.toString())
                    if(data.toString().localeCompare(compare)){
                        resolve(data.toString())
                    }else{
                        reject('Respuesta no esperada')
                    }

                    stream.end()
                    conn.end()
                }).stderr.on('data', function(data) {
                    reject(data.toString())
                    stream.end()
                    conn.end()
                });
            })
        }catch(err){
            reject(err)
        }
    })
}

export function saveNode(data, schedule){
    return new Promise(async (resolve, reject) => {
        try {
            const conn = await connectToRasberry()

            const node = data  // Unsaved data, from form
            const role = 0  // FIXME role always zero

            if (!schedule || schedule.length < 1) {
                console.log('No hay horarios registrados')
                conn.end()
                resolve()
                return
            }

            // "1:00:00:00 1:00:15:00 1:01:00:00 1:01:15:00 1:02:30:00 1:02:45:00 4:03:15:00 4:03:30:00 6:04:30:00 6:04:45:00"
            const scheduleArgs = schedule.map((s) => { return `${s.daysOfWeek[0]}:${s.startTime} ${s.daysOfWeek[0]}:${s.endTime}` }).join(' ')
            const shell = `./aireadores-server/aircontrol.py set_schedule ${node.address} ${node.channel} ${node.device_id} ${role} ${node.num} ${scheduleArgs}`
            console.log(shell)
            // respuesta esperada para devolver positivo
            const compare = `comando shell`

            conn.exec(shell, function(err, stream){
                if (err)
                    reject(err);

                stream
                .on('data', function(data) {
                    console.log('STDOUT::', data.toString())
                    if(data.toString().localeCompare(compare)){
                        resolve(data.toString())
                    }else{
                        reject('Respuesta no esperada')
                    }

                    stream.end()
                    conn.end()
                }).stderr.on('data', function(data) {
                    reject(data.toString())
                    stream.end()
                    conn.end()
                });
            })
        }catch(err){
            reject(err)
        }
    })
}