import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, CardHeader, CardBody, Input, Form, FormGroup, Label, Button } from 'reactstrap'
import { ViewState } from "@devexpress/dx-react-scheduler";
/*import {
    Scheduler,
    WeekView,
    Appointments,
} from "@devexpress/dx-react-scheduler-material-ui";*/
import { turnOnNode } from 'helpers/connect-ssh'
import data from './calendar-data'
import moment from 'moment';
import 'moment/locale/es'
import Swal from 'sweetalert2';
import models from 'models'

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

const save = async (data) => {
    try {
        if(!data.address) throw new Error('Dirección requerida')
        if(!data.num) throw new Error('Aireadores requeridos')
        if(Number(data.num)%2 !== 0) throw new Error('Los aireadores deben ser un número par')
        if(!data.channel) throw new Error('Canal requerido')
        if(!data.pool) throw new Error('Psicina requerido')
        if(!data.rssi) throw new Error('Identificador requerido')
        if(!data.status) throw new Error('Estado requerido')

        await models.node.create(data)
    }
    catch(err){
        Swal.fire('Guardar Nodo', err, 'error')
    }
}

const Node = () => {
    const [formData, setFormData] = useState({ address : '', num : 0, channel : '', pool : '', rssi : '', status : '' })
    const [mode, setMode] = useState('programar')
    const time = useTime()
    
    const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        })
    }

    return (
        <>
            <Container fluid>
                <Row>
                    <Col className="mb-5 mb-xl-0">
                        <Card className="shadow" style={{minHeight: 300}}>
                            <CardHeader className="bg-secondary">
                                Cread/Editar Nodo
                            </CardHeader>
                            <CardBody>
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
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col xs={6}>
                                            <FormGroup row>
                                                <Label sm={3}>Piscina</Label>
                                                <Col sm={9} lg={6}>
                                                    <Input
                                                        type="text"
                                                        name="pool"
                                                        onChange={onChange}
                                                    />
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
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col xs={6}>
                                            <FormGroup row>
                                                <Label sm={3}>Estado</Label>
                                                <Col sm={9} lg={6}>
                                                    <Input type="select" name="status" onChange={onChange}>
                                                        <option value="">Seleccione</option>
                                                        <option value="encendido">Encendido</option>
                                                        <option value="apagado">Apagado</option>
                                                    </Input>
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={6}>
                                            <Button color="success" onClick={() => save(formData)}>
                                                Guardar
                                            </Button>
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
                                        {/*<Scheduler data={data} locale={'es-ES'}>
                                            <ViewState currentDate="2020-06-28" />
                                            <WeekView startDayHour={9} endDayHour={19} />
                                            <Appointments />
                                        </Scheduler>*/}
                                    </Col>
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
                                                                <Button block onClick={() => connectToNode(1)}>
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
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Node