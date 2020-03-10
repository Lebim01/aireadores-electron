import {Client} from 'ssh2'
import fs from 'fs'
import models from 'models'
import moment from 'moment'

export async function createEvent(node, { action, response, node_status, status }){
    const fieldsToCreate = {
        node_id : node.id,
        node_repr : JSON.stringify(node),
        response,
        action,
        node_status,
        status,
    }
    const instance = models.event.build(fieldsToCreate)
    console.log('event created', instance)
    return await instance.save()
}

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
                    role,  // TODO get it from frontend
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

export function statusNode(node_id){
    return new Promise(async (resolve, reject) => {
        try {
            const { conn, node } = await connectToNode(node_id)

            // comando que se ejecuta
            const shell = `./aireadores-server/aircontrol.py status ${node.address} ${node.channel} ${node.device_id} ${node.role}`
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


            console.log(schedule)
            // "1:00:00:00 1:00:15:00 1:01:00:00 1:01:15:00 1:02:30:00 1:02:45:00 4:03:15:00 4:03:30:00 6:04:30:00 6:04:45:00"
            const scheduleArgs = schedule
                .sort((a, b) => {
                    if(a.daysOfWeek[0] < b.daysOfWeek[0]) return -1
                    if(a.daysOfWeek[0] > b.daysOfWeek[0]) return 1

                    let aTime = moment(a.startTime, 'HH:mm:ss');
                    let bTime = moment(b.startTime, 'HH:mm:ss');
                    if(aTime.isBefore(bTime)) return -1
                    if(aTime.isAfter(bTime)) return 1

                    return 0
                })
                .map((s) => { return `${s.daysOfWeek[0]}:${moment(s.startTime, 'HH:mm:ss').format('HH:mm')} ${s.daysOfWeek[0]}:${moment(s.endTime, 'HH:mm:ss').format('HH:mm')}` }).join(' ')
            console.log(scheduleArgs)

            /* filter schedule */
            let scheduleFinalArgs = ''
            let scheduleArray = scheduleArgs.split(' ')
            for(let i = 0; i < scheduleArray.length; i++){
                let time_str = scheduleArray[i];
                if(  (i != 0)  &&  (i != scheduleArray.length - 1)  ){
                    if(i%2 === 1){
                        //impar -> end
                        let current_end = time_str;
                        let next_start = scheduleArray[i + 1];
                        if(current_end.substring(2) === '23:59'  &&  next_start.substring(2) == '00:00'){
                            let current_end_day = parseInt(current_end.substring(0,1), 10);
                            let next_start_day = parseInt(next_start.substring(0,1), 10);
                            if(next_start_day === current_end_day + 1){
                                i++; //to not consider the next start
                                continue;
                            }
                        }
                    }
                }
                scheduleFinalArgs += time_str;
                if (i != scheduleArray.length - 1) scheduleFinalArgs += ' ';
            };

            const shell = `./aireadores-server/aircontrol.py set_schedule ${node.address} ${node.channel} ${node.device_id} ${node.role} ${node.num} ${scheduleFinalArgs}`
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