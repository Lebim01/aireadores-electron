import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, CardHeader, CardBody } from 'reactstrap'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import models from 'models'

const HistoryNodes = (props) => {

    const [data, setData] = useState([])

    useEffect(() => {
        const getHistory = async () => {
            const result = await models.timer_history.findAll({ include : [models.node] })
            setData(result.map(record => ({
                start : record.start_datetime,
                end : record.end_datetime,
                title : `Nodo #${record.node.rssi}`
            })))
        }
        getHistory()
    }, [])

    return (
        <>
            <Container fluid>
                <Row>
                    <Col className="mb-5 mb-xl-0">
                        <Card className="shadow" style={{minHeight: 300}}>
                            <CardHeader className="bg-secondary">
                                Historial de nodos
                            </CardHeader>
                            <CardBody>
                                <FullCalendar
                                    defaultView="timeGridWeek"
                                    plugins={[ timeGridPlugin ]}
                                    locale={'es-ES'}
                                    nowIndicator

                                    events={data}
                                    eventTextColor="#fff"

                                    allDaySlot={false}
                                    slotDuration={'00:15:00'}
                                    slotLabelFormat={{
                                        hour: 'numeric',
                                        minute: '2-digit',
                                    }}
                                    weekNumberCalculation="ISO"
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default HistoryNodes
