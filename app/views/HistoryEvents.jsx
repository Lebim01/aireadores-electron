import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, CardHeader, CardBody, Table } from 'reactstrap'
import Pagination from 'components/Pagination'
import models from 'models'
import moment from 'moment'
import sequelize, { where } from 'sequelize'
import { useFetchAsync } from 'hooks'
import Select from 'components/SelectAsync'

const arrayToWhere = (array) => {
    let _where = {}
    for(let i in array){
        let [key, value] = array[i]
        _where[key] = value
    }
    return _where
}

const HistoryEvents = (props) => {

    const perPage = 10
    const [totalPages, setTotalPages] = useState(1)
    const [page, setPage] = useState(0)
    const [paginationOptions, setPaginationOptions] = useState({ limit: perPage }) // limit & offset
    const [where, setWhere] = useState({ pool : '', node : '' })

    useEffect(() => {
        const load = async () => {
            const query = { 
                raw : true,
                attributes : [
                    [sequelize.fn('COUNT', sequelize.col('id')), 'total']
                ]
            }
            const { total } = await models.event.findOne(query)
            setTotalPages(Math.ceil(total/perPage))
        }
        load()
    }, [perPage])

    useEffect(() => {
        refresh()
    }, [paginationOptions, where])

    const query = {
        model : 'event',
        include : [
            { 
                model : models.node, 
                attributes : ['device_id', 'pool_id', 'address', 'channel'], 
                include : [
                    { 
                        model : models.pool, 
                        attributes : ['name'],
                    }
                ],
                where : {
                    ...(where.pool ? { pool_id : where.pool } : {})
                }
            },
        ],
        where : {
            ...(where.node ? { node_id: where.node } : {})
        }
    }

    const { data, loading, error, refresh } = useFetchAsync(query)

    const query_pool = {
        model : 'pool',
        valueName : 'id',
        labelName : 'name'
    }
    const query_node = {
        model : 'node',
        valueName : 'id',
        labelName : 'device_id',
        where : {
            pool_id : where.pool
        }
    } 

    return (
        <>
            <Container fluid>
                <Row>
                    <Col className="mb-5 mb-xl-0">
                        <Card className="shadow" style={{minHeight: 300}}>
                            <CardHeader className="bg-secondary">
                                Historial de eventos
                            </CardHeader>
                            <CardBody style={{textAlign:'center'}}>
                                <Row>
                                    <Col md={{ size: 4, offset: 2 }}>
                                        <label>Pscina</label>
                                        <Select query={query_pool} value={where.pool} onChange={(e) => setWhere({...where, pool: e.target.value})}>
                                            <option value="">Seleccione</option>
                                        </Select>
                                    </Col>
                                    <Col md={4}>
                                        <label>Nodo</label>
                                        <Select query={query_node} value={where.node} onChange={(e) => setWhere({...where, node: e.target.value})}>
                                            <option value="">Seleccione</option>
                                        </Select>
                                    </Col>
                                </Row>
                                <br/>
                                <br/>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Piscina</th>
                                            <th>Dirección</th>
                                            <th>Canal</th>
                                            <th>Fecha</th>
                                            <th>Acción</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {(data || []).map((row, i) => 
                                            <tr key={i}>
                                                <td>{row['node.pool.name']}</td>
                                                <td>{row['node.address']}</td>
                                                <td>{row['node.channel']}</td>
                                                <td>{moment(row.createdAt).format('DD/MM/YYYY HH:mm:ss')}</td>
                                                <td>{row.action}</td>
                                                <td>{row.status}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                                <Pagination 
                                    current={page}
                                    pages={totalPages} 
                                    setPage={setPage} 
                                    perPage={perPage}
                                    setPaginationOptions={setPaginationOptions} 
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default HistoryEvents
