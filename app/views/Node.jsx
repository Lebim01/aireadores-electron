import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, CardHeader, CardBody, Input, Form, FormGroup, Label, Button } from 'reactstrap'
import { turnOnNode } from 'helpers/connect-ssh'
import data from './calendar-data'
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

const connectToNode = (node_id) => {
    Swal.fire({
        title : 'Conectar a nodo',
        text : 'Presionar OK para conectar',
        showLoaderOnConfirm: true,
        showCancelButton: true,
        allowOutsideClick: () => !Swal.isLoading(),
        preConfirm : () => {
            return turnOnNode(node_id)
                .then(() => {
                    Swal.fire('Conectado', '', 'success')
                })
                .catch(error => {
                    Swal.showValidationMessage(error)
                })
        }
    })
}

const Node = ({ match, history }) => {
    const [dataForm, setDataForm] = useState({ address : '', num : 0, channel : '', pool : '', rssi : '', status : '' })
    const [mode, setMode] = useState('programar')
    const time = useTime()
    
    const onChange = (e) => {
        setDataForm({
            ...dataForm,
            [e.target.name] : e.target.value
        })
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
                                    name="rssi"
                                    onChange={onChange}
                                    value={dataForm.rssi}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs={6}>
                        <FormGroup row>
                            <Label sm={3}>Estado</Label>
                            <Col sm={9} lg={6}>
                                <Input type="select" name="status" onChange={onChange} value={dataForm.status}>
                                    <option value="">Seleccione</option>
                                    <option value="encendido">Encendido</option>
                                    <option value="apagado">Apagado</option>
                                </Input>
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

                        allDaySlot={false}
                        slotLabelFormat={{
                            hour: 'numeric',
                            minute: '2-digit',
                        }}

                        header={false}

                        columnHeaderFormat={{
                            weekday: 'long'
                        }}

                        selectable
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
                                <Button color={mode === 'programar' ? 'success' : 'secondary'} onClick={() => setMode('programar')}>
                                    Programar
                                </Button>
                            </Col>
                            <Col xs={12}>
                                <br/>
                                <Button color={mode !== 'programar' ? 'danger' : 'secondary'} onClick={() => setMode('inabilitar')}>
                                    Inhabilitar
                                </Button>
                            </Col>
                            { mode === 'inabilitar' &&
                                <Col xs={12}>
                                    <hr />
                                    <fieldset>
                                        <legend>Manual</legend>
                                        <Row>
                                            <Col xs={12}>
                                                <Button block onClick={() => connectToNode(dataForm.id)}>
                                                    Encender
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12}>
                                                <br/>
                                                <Button block>
                                                    Apagar
                                                </Button>
                                            </Col>
                                        </Row>
                                    </fieldset>
                                </Col>
                            }
                        </Row>
                    </Col>
                }
            </Row>
        </EditPage>
    )
}

export default Node