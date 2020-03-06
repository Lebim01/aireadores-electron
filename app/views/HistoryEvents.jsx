import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, CardHeader, CardBody, Table } from 'reactstrap'
import models from 'models'
import moment from 'moment'
import { useFetchAsync } from 'hooks'

const HistoryEvents = (props) => {

    const query = {
        model : 'event',
        include : [
            { model : models.node, attributes : ['device_id', 'pool_id'], include : [{ model : models.pool }] }
        ]
    }
    const { data, loading, error } = useFetchAsync(query)

    console.log(data)

    return (
        <>
            <Container fluid>
                <Row>
                    <Col className="mb-5 mb-xl-0">
                        <Card className="shadow" style={{minHeight: 300}}>
                            <CardHeader className="bg-secondary">
                                Historial de eventos
                            </CardHeader>
                            <CardBody>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Psicina</th>
                                            <th>Nodo</th>
                                            <th>Fecha</th>
                                            <th>Acción</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {(data || []).map((row, i) => 
                                            <tr key={i}>
                                                <td>{row['node.pool.name']}</td>
                                                <td>{row['node.device_id']}</td>
                                                <td>{moment(row.createdAt).format('DD/MM/YYYY HH:mm:ss')}</td>
                                                <td>{row.action}</td>
                                                <td>{row.status}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default HistoryEvents
