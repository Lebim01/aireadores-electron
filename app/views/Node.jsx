import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Card, CardHeader, CardBody, Input, Form, FormGroup, Label, Button } from 'reactstrap'
import { turnOnNode, pingNode, enableProgramNode, saveNode, disableNode } from 'helpers/connect-ssh'
import moment from 'moment';
import 'moment/locale/es'
import Swal from 'sweetalert2';
import models from 'models'
import EditPage from 'components/Catalog/EditPage'
import SelectAsync from 'components/SelectAsync'

import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction';

const useTime = () => {
    const [time, setTime] = useState(moment())

    useEffect(() => {
        let interval = setInterval(() => {
            setTime(moment())
        }, 60 * 1000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    return time
}

const Node = ({ match, history }) => {
    const editPage = useRef(null)
    const [dataForm, setDataForm] = useState({ address : '', num : 0, channel : '', pool : '', rssi : '', status : 'desconectado' })
    const [disabled, setDisabled] = useState(false)
    const [timers, setTimers] = useState([])
    const [timersDeleted, setTimersDeleted] = useState([])
    const time = useTime()

    /** BUTTONS */
    const [classBtn, setClassBtn] = useState({})

    useEffect(() => {
        getTimers()
    }, [])

    const onChange = (e) => {
        setDataForm({
            ...dataForm,
            [e.target.name] : e.target.value
        })
        setDisabled(true)
    }

    const confirmSchedule = (data) => {
        Swal.fire({
            title : 'Programar horario de encendido',
            html : `Encendido: ${moment(data.start).format('dddd, HH:mm:ss')} <br/> Apagado: ${moment(data.end).format('dddd, HH:mm:ss')}`,
            showLoaderOnConfirm: true,
            showCancelButton: true,
        })
        .then(result => {
            if(result.value){
                setTimers([
                    ...timers,
                    {
                        daysOfWeek : [ moment(data.start).day() ],
                        startTime : moment(data.start).format('HH:mm:ss'),
                        endTime : moment(data.end).format('HH:mm:ss')
                    }
                ])
                setDisabled(true)
            }
        })
    }

    const confirmDeleteTimer = (timers, data) => {
        const _instance = data.event
        Swal.fire({
            title : '¿Quieres eliminar este timer?',
            html : `Encendido: ${moment(_instance.start).format('dddd, HH:mm:ss')} <br/> Apagado: ${moment(_instance.end).format('dddd, HH:mm:ss')}`,
            showCancelButton: true,
        })
        .then(result => {
            if(result.value){
                let _timers = [ ...timers ]
                setTimersDeleted(_timers.splice(
                    _timers.findIndex(row => 
                        row.startTime === moment(_instance.start).format('HH:mm:ss')
                        && row.endTime === moment(_instance.end).format('HH:mm:ss')
                    ),
                    1
                ))
                setTimers(_timers)
                setDisabled(true)
            }
        })
    }

    /** SAVE/GET */

    const preSave = async (data) => {
        try {
            const output = await saveNode(data, timers)
            let displayOutput = outputs.find(({ out }) => output.includes(out)) || { display : `Output desconocido: ${output}`, fire: 'warning' }
            return {
                message : displayOutput.display,
                status : displayOutput.fire === 'success'
            }
        }catch(err){
            return {
                status : false,
                message: err
            }
        }
    }

    const timerFullcalendarToModel = (timer) => {
        return {
            id : timer.id,
            start_day : timer.daysOfWeek[0],
            start_time : timer.startTime,
            end_day : timer.daysOfWeek[0],
            end_time : timer.endTime
        }
    }

    const timerModelToFullcalendar = (timer) => {
        return {
            id : timer.id,
            daysOfWeek : [ timer.start_day ],
            startTime : timer.start_time,
            endTime : timer.end_time
        }
    }

    const getTimers = async () => {
        if(match.params.id){
            const result = await models.timer.findAll({ where : { node_id : match.params.id } })
            setTimers(result.map(record => timerModelToFullcalendar(record)))
        }
    }

    const saveTimers = async (record) => {
        setDataForm({ ...record.dataValues })
        try {
            for(let i in timers){
                let timer = timerFullcalendarToModel(timers[i])

                let instance
                if(timer.id){
                    instance = await models.timer.findByPk(timer.id)
                    Object.assign(instance, timer)
                }else{
                    instance = models.timer.build({
                        node_id : record.id,
                        ...timer
                    })
                }
                await instance.validate()
                await instance.save()

                timers[i].id = instance.dataValues.id
            }
            
            for(let i in timersDeleted){
                let timer = timerFullcalendarToModel(timersDeleted[i])

                let instance
                if(timer.id){
                    instance = await models.timer.findByPk(timer.id)
                    await instance.destroy()
                }
            }

            setDisabled(false)
        }catch(e){
            throw e
        }
    }

    /** SSH METHODS */

    const saveStatus = (status) => {
        setDataForm({ ...dataForm, status })
        editPage.current.save(false)
    }

    const outputs = [
        { out : 'time out for MSG exceeded', display : "Error: El nodo no responde", fire: '' },
        { out : 'STATUS_ERROR', display : "Error fatal: Consultar con soporte", fire: 'error' },
        { out : 'STATUS_OK', display : "Operación ejecutada satisfactoriamente", fire: 'success' }
    ]

    const statuses = [
        { status : 'desconectado', font : '' },
        { status : 'horario', font : 'text-success' },
        { status : 'detener', font : 'text-danger' },
        { status : 'manual', font : 'text-warning' },
    ]

    const showDisplayOutput = (output) => {
        let displayOutput = outputs.find(({ out }) => output.includes(out)) || { display : `Output desconocido: ${output}`, fire: 'warning' }
        Swal.fire(displayOutput.display, '', displayOutput.fire)
        return displayOutput.fire === 'success'
    }

    const modalLoading = (title, text, execute) => {
        Swal.fire({
            title : title,
            text : text,
            allowOutsideClick: () => !Swal.isLoading(),
            onBeforeOpen : () => {
                Swal.showLoading()
                return execute()
            }
        })
    }

    const pingNodo = () => {
        modalLoading('Conectando', 'Ejecutando ping...', () => {
            return pingNode(dataForm.id)
            .then((output) => {
                Swal.hideLoading()
                if(!showDisplayOutput(output)){
                    saveStatus('desconectado')
                }
            })
            .catch(error => {
                Swal.hideLoading()
                Swal.showValidationMessage(error)
                saveStatus('desconectado')
            })
        })
    }

    const encenderNodo = () => {
        Swal.fire({
            title : 'Encender nodo manual',
            input : 'number',
            inputAttributes : {
                placeholder : 'Minutos'
            },
            text : 'Presionar OK para continuar',
            showLoaderOnConfirm: true,
            showCancelButton: true
        }).then(({value}) => {
            if(value){
                modalLoading('Encender nodo manualmente', '', () => {
                    return turnOnNode(dataForm.id, value)
                    .then((output) => {
                        if(showDisplayOutput(output)){
                            saveStatus('manual')
                        }else{
                            saveStatus('desconectado')
                        }
                    })
                    .catch(error => {
                        Swal.showValidationMessage(error)
                        saveStatus('desconectado')
                    })
                })
            }
        })
    }
    
    const apagarNodo = () => {
        Swal.fire({
            title : 'Apagar nodo manual',
            text : 'Presionar OK para continuar',
            showLoaderOnConfirm: true,
            showCancelButton: true,
        }).then(({value}) => {
            if(value){
                modalLoading('Apagar nodo manualmente', '', () => {
                    return turnOnNode(dataForm.id)
                    .then((output) => {
                        if(showDisplayOutput(output)){
                            saveStatus('desconectado')
                        }else{
                            saveStatus('desconectado')
                        }
                    })
                    .catch(error => {
                        Swal.showValidationMessage(error)
                        saveStatus('desconectado')
                    })
                })
            }
        })
    }
    
    const habilitarNodo = () => {
        Swal.fire({
            title : 'Habilitar programa nodo',
            html:
                '<input id="swal-input1" class="swal2-input" placeholder="Minutos" type="number">' +
                '<input id="swal-input2" class="swal2-input" placeholder="Aireadores" type="number">',
            showLoaderOnConfirm: true,
            showCancelButton: true,
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value
                ]
            }
        }).then(({ value }) => {
            if(value !== undefined){
                const minutos = value[0]
                const aireadores = value[1]

                if(!minutos){
                    Swal.fire('', 'La cantidad de minutos es requerida', 'error')
                }
                else if(!aireadores){
                    Swal.fire('', 'La cantidad de aireadores es requerida', 'error')
                }
                else if(aireadores > dataForm.num){
                    Swal.fire('', 'La cantidad maxima de aireadores es ' + dataForm.num, 'error')
                }
                else {
                    modalLoading('Habilitando modo horario', '', () => {
                        return enableProgramNode(dataForm.id, minutos, aireadores)
                        .then((output) => {
                            if(showDisplayOutput(output)){
                                saveStatus('horario')
                            }else{
                                saveStatus('desconectado')
                            }
                        })
                        .catch(error => {
                            Swal.showValidationMessage(error)
                            saveStatus('desconectado')
                        })
                    })
                }
            }
        })
    }
    
    const deshabilitarNodo = () => {
        Swal.fire({
            title : 'Deshabilitar programa nodo',
            text : 'Presionar OK para continuar',
            showLoaderOnConfirm: true,
            showCancelButton: true
        }).then(({value}) => {
            if(value){
                modalLoading('Deshabilitar programa nodo', '', () => {
                    return disableNode(dataForm.id)
                        .then((output) => {
                            if(showDisplayOutput(output)){
                                saveStatus('detenido')
                            }else{
                                saveStatus('desconectado')
                            }
                        })
                        .catch(error => {
                            Swal.showValidationMessage(error)
                            saveStatus('desconectado')
                        })
                })
            }
        })
    }

    return (
        <EditPage
            model="node"
            route="/admin/nodos"
            title="Crear/Editar Nodo"
            dataForm={dataForm}
            setDataForm={setDataForm}
            match={match}
            history={history}
            onSave={saveTimers}
            onBeforeSave={preSave}
            noRedirect
            ref={editPage}
        >
            <Form>
                <Row>
                    <Col xs={6}>
                        <FormGroup row>
                            <Label sm={3}>Dirección</Label>
                            <Col sm={9} lg={6}>
                                <Input
                                    type="text"
                                    name="address"
                                    onChange={onChange}
                                    value={dataForm.address}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs={6}>
                        <FormGroup row>
                            <Label sm={3}>Aireadores</Label>
                            <Col sm={9} lg={6}>
                                <Input
                                    type="number"
                                    name="num"
                                    onChange={onChange}
                                    value={dataForm.num}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col xs={6}>
                        <FormGroup row>
                            <Label sm={3}>Canal</Label>
                            <Col sm={9} lg={6}>
                                <Input
                                    type="text"
                                    name="channel"
                                    onChange={onChange}
                                    value={dataForm.channel}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs={6}>
                        <FormGroup row>
                            <Label sm={3}>Piscina</Label>
                            <Col sm={9} lg={6}>
                                <SelectAsync name="pool_id" query={{ model : 'pool', valueName : 'id', labelName : 'name' }} onChange={onChange} value={dataForm.pool_id}>
                                    <option>Seleccione</option>
                                </SelectAsync>
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col xs={6}>
                        <FormGroup row>
                            <Label sm={3}>Identificador</Label>
                            <Col sm={9} lg={6}>
                                <Input
                                    type="number"
                                    name="device_id"
                                    onChange={onChange}
                                    value={dataForm.device_id}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs={6}>
                        <FormGroup row>
                            <Label sm={3}>Estado</Label>
                            <Col sm={9} lg={6}>
                                <label className={(statuses.find(row => dataForm.status === row.status) ||  {}).font}>
                                    {dataForm.status}
                                </label>
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
            </Form>

            <Row>
                <Col>
                    <hr></hr>
                </Col>
            </Row>

            <Row>
                <Col xs={8} lg={10}>
                    <FullCalendar
                        defaultView="timeGridWeek"
                        plugins={[ timeGridPlugin, interactionPlugin ]}
                        locale={'es-ES'}
                        nowIndicator

                        events={timers}
                        eventClick={(data) => {
                            confirmDeleteTimer(timers, data)
                        }}
                        eventTextColor="#fff"

                        allDaySlot={false}
                        slotDuration={'00:15:00'}
                        weekNumberCalculation="ISO"
                        slotLabelFormat={{
                            hour: 'numeric',
                            minute: '2-digit',
                        }}

                        header={false}

                        columnHeaderFormat={{
                            weekday: 'long'
                        }}

                        selectable
                        selectAllow={(selectInfo) => {
                            return moment(selectInfo.start).date() === moment(selectInfo.end).date()
                        }}
                        select={(data) => {
                            confirmSchedule(data)
                        }}
                    />
                </Col>
                { dataForm.id &&
                    <Col xs={4} lg={2} className="text-center">
                        <Row>
                            <Col xs={12}>
                                <Label>{time.format('D [de] MMMM [de] YYYY')}</Label>
                            </Col>
                            <Col xs={12}>
                                <Label>{time.format('dddd, HH:mm')}</Label>
                            </Col>
                            <Col xs={12}>
                                <hr />
                                <fieldset>
                                    <legend>Horario</legend>
                                    <Row>
                                        <Col xs={12}>
                                            <Button block color={'success'} onClick={() => habilitarNodo()} disabled={disabled || dataForm.status === 'ejecutar'}>
                                                Ejecutar
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            <br/>
                                            <Button block color={'danger'} onClick={() => deshabilitarNodo() } disabled={disabled || dataForm.status === 'desconectado'}>
                                                Detener
                                            </Button>
                                        </Col>
                                    </Row>
                                </fieldset>
                            </Col>
                            <Col xs={12}>
                                <hr />
                                <fieldset>
                                    <legend>Manual</legend>
                                    <Row>
                                        <Col xs={12}>
                                            <Button block onClick={() => pingNodo()} disabled={disabled}>
                                                Prueba
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            <br/>
                                            <Button block onClick={() => encenderNodo()} disabled={disabled} className="bg-yellow">
                                                Encender
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            <br/>
                                            <Button block color={'danger'} onChange={() => apagarNodo()} disabled={disabled || dataForm.status === 'detenido'}>
                                                Detener
                                            </Button>
                                        </Col>
                                    </Row>
                                </fieldset>
                            </Col>
                        </Row>
                    </Col>
                }
            </Row>
        </EditPage>
    )
}

export default Node
