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
                    role,
                    num,
                    rssi
                }
            } = nodeInstance

            resolve({
                conn, 
                node : {
                    address,
                    channel,
                    role,
                    num,
                    rssi
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
        const { conn, node } = await connectToNode(node_id)

        // comando que se ejecuta
        const shell = `echo encender --address ${node.address} --channel ${node.channel} --role ${node.role} --num ${node.num} --rssi ${node.rssi}`
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
                    reject('Respuesta no esperada')
                }
                
                stream.end()
            });
        })

        const schedule = await models.timer.findAll({ where: { node_id } })

        await Promise.all(schedule.map(({ start_day, start_time, end_day, end_time }) => {
            return new Promise((resolve, reject) => {
                conn.exec(`echo programar nodo --start_day ${start_day} --start_time ${start_time} --end_day ${end_day} --end_time ${end_time}`, (err, stream) => {
                    if (err)
                        reject(err);
            
                    stream.on('data', function(data) {
                        console.log('STDOUT::', data.toString())
                        if(data.toString().localeCompare(compare)){
                            resolve()
                        }else{
                            reject('Respuesta no esperada')
                        }
                        
                        stream.end()
                        resolve()
                    });
                })
            })
        }))

        conn.end()
    })
}

export async function turnOnNode(node_id){
    return new Promise(async (resolve, reject) => {
        try {
            const { conn, node } = await connectToNode(node_id)

            // comando que se ejecuta
            const shell = `echo encender --address ${node.address} --channel ${node.channel} --role ${node.role} --num ${node.num} --rssi ${node.rssi}`
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
                        reject('Respuesta no esperada')
                    }
                    
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
        const { conn, node } = await connectToNode(node_id)

        // comando que se ejecuta
        const shell = `echo apagar --address ${node.address} --channel ${node.channel} --role ${node.role} --num ${node.num} --rssi ${node.rssi}`
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
                    reject('Respuesta no esperada')
                }
                
                stream.end()
                conn.end()
            });
        })
    })
}

export function enableNode(node_id){
    return new Promise(async (resolve, reject) => {
        const { conn, node } = await connectToNode(node_id)

        // comando que se ejecuta
        const shell = `echo programar --address ${node.address} --channel ${node.channel} --role ${node.role} --num ${node.num} --rssi ${node.rssi}`
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
                    reject('Respuesta no esperada')
                }
                
                stream.end()
                conn.end()
            });
        })
    })
}

export function disableNode(node_id){
    return new Promise(async (resolve, reject) => {
        const { conn, node } = await connectToNode(node_id)

        // comando que se ejecuta
        const shell = `echo inabilitar --address ${node.address} --channel ${node.channel} --role ${node.role} --num ${node.num} --rssi ${node.rssi}`
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
                    reject('Respuesta no esperada')
                }
                
                stream.end()
                conn.end()
            });
        })
    })
}

export async function pingNode(node_id){
    return new Promise(async (resolve, reject) => {
        const { conn, node } = await connectToNode(node_id)

        // comando que se ejecuta
        const shell = `./aireadores-server/aircontrol.py ping ${node.address} ${node.rssi} ${node.channel} ${node.role}`
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
            });
        })
    })
}