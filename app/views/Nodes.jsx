import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  CardBody
} from "reactstrap";
import { TableAsync } from 'components/Catalog'
import models from 'models'
import SelectAsync from 'components/SelectAsync'

const Ssh = ({ history, location }) => {

    const [poolId, setPoolId] = useState('')

    return (
        <>
            <Container fluid>
                <Row>
                    <Col className="mb-5 mb-xl-0">
                        <Card className="shadow" style={{minHeight: 300}}>
                            <CardHeader className="bg-secondary">
                                Listado de nodos
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col xs="4">
                                        Psicina
                                        <SelectAsync query={{ model : 'pool', valueName : 'id', labelName : 'name' }} onChange={(e) => setPoolId(e.target.value)} value={poolId}>
                                            <option value="">Seleccione</option>
                                        </SelectAsync>
                                    </Col>
                                </Row>
                                <TableAsync
                                    query={{
                                        model : 'node',
                                        include : [
                                            { model : models.pool }
                                        ],
                                        where : {
                                            ...(poolId ? { pool_id : poolId } : {})
                                        }
                                    }}
                                    header={[
                                        ['Piscina', 'Nodo', 'Aireadores', 'Estado']
                                    ]}
                                    body={[
                                        'pool.name', 'address', 'num', 'status'
                                    ]}
                                    history={history}
                                    location={location}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Ssh;
