import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, CardHeader, CardBody, Input, Form, FormGroup, Label, Button } from 'reactstrap'
import { turnOnNode, pingNode, enableProgramNode } from 'helpers/connect-ssh'
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
    const [dataForm, setDataForm] = useState({ address : '', num : 0, channel : '', pool : '', rssi : '', status : 'encendido' })
    const [mode, setMode] = useState('programar')
    const [disabled, setDisabled] = useState(false)
    const [timers, setTimers] = useState([])
    const [timersDeleted, setTimersDeleted] = useState([])
    const time = useTime()

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

    const getTimers = async () => {
        if(match.params.id){
            const result = await models.timer.findAll({ where : { node_id : match.params.id } })
            setTimers(result.map(record => ({
                id : record.id,
                daysOfWeek : [ record.start_day ],
                startTime : record.start_time,
                endTime : record.end_time
            })))
        }
    }

    const saveTimers = async (record) => {
        setDataForm({ ...record.dataValues })
        try {
            for(let i in timers){
                let timer = {
                    id : timers[i].id,
                    start_day : timers[i].daysOfWeek[0],
                    start_time : timers[i].startTime,
                    end_day : timers[i].daysOfWeek[0],
                    end_time : timers[i].endTime
                }

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
            }
            
            for(let i in timersDeleted){
                let timer = {
                    id : timersDeleted[i].id,
                    start_day : timersDeleted[i].daysOfWeek[0],
                    start_time : timersDeleted[i].startTime,
                    end_day : timersDeleted[i].daysOfWeek[0],
                    end_time : timersDeleted[i].endTime
                }

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

    const pingNodo = () => {
        Swal.fire({
            title : 'Connectando',
            text : 'Ejecutando ping...',
            allowOutsideClick: () => !Swal.isLoading(),
            onBeforeOpen : () => {
                Swal.showLoading()
                return pingNode(dataForm.id)
                    .then((output) => {
                        Swal.hideLoading()
                        Swal.close()
                        Swal.fire(output)
                        return output
                    })
                    .catch(error => {
                        Swal.showValidationMessage(error)
                    })
            }
        }).then((output) => {
            // debugger
            // Swal.close()
            // Swal.fire('Resultado', output, 'success')
        })
    }

    const encenderNodo = () => {
        Swal.fire({
            title : 'Encender nodo manual',
            text : 'Presionar OK para continuar',
            showLoaderOnConfirm: true,
            showCancelButton: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm : () => {
                return turnOnNode(dataForm.id)
                    .then((output) => {
                        Swal.fire('Encendido', '', 'success')
                    })
                    .catch(error => {
                        Swal.showValidationMessage(error)
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
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm : () => {
                return turnOnNode(dataForm.id)
                    .then(() => {
                        Swal.fire('Apagado', '', 'success')
                    })
                    .catch(error => {
                        Swal.showValidationMessage(error)
                    })
            }
        })
    }
    
    const habilitarNodo = () => {
        Swal.fire({
            title : 'Habilitar programa nodo',
            text : 'Presionar OK para continuar',
            showLoaderOnConfirm: true,
            showCancelButton: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm : () => {
                return enableProgramNode(dataForm.id)
                    .then(() => {
                        setMode('programar');
                        Swal.fire('Habilitado', '', 'success')
                    })
                    .catch(error => {
                        Swal.showValidationMessage(error)
                    })
            }
        })
    }
    
    const deshabilitarNodo = () => {
        Swal.fire({
            title : 'Deshabilitar programa nodo',
            text : 'Presionar OK para continuar',
            showLoaderOnConfirm: true,
            showCancelButton: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm : () => {
                return 
                    turnOnNode(dataForm.id)
                    .then(() => {
                        Swal.fire('Deshabilitado', '', 'success')
                        setMode('inabilitar');
                    })
                    .catch(error => {
                        Swal.showValidationMessage(error)
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
            noRedirect
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
                                <label>{dataForm.status}</label>
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
                            if(!disabled)
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
                            if(!disabled)
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
                                <Button color={mode === 'programar' ? 'success' : 'secondary'} onClick={() => habilitarNodo()} disabled={disabled}>
                                    Programar
                                </Button>
                            </Col>
                            <Col xs={12}>
                                <br/>
                                <Button color={mode !== 'programar' ? 'danger' : 'secondary'} onClick={() => deshabilitarNodo() } disabled={disabled}>
                                    Inhabilitar
                                </Button>
                            </Col>
                            <Col xs={12}>
                                <hr />
                                <fieldset>
                                    <legend>Manual</legend>
                                    <Row>
                                        <Col xs={12}>
                                            <Button block onClick={() => pingNodo()} disabled={disabled}>
                                                Ping
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            <br/>
                                            <Button block onClick={() => encenderNodo()} disabled={disabled}>
                                                Encender
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            <br/>
                                            <Button block onChange={() => apagarNodo()} disabled={disabled}>
                                                Apagar
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
