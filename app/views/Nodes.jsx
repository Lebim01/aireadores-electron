import React from "react";
import {
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  CardBody
} from "reactstrap";
import { TableAsync } from 'components/Catalog'

const Ssh = () => {
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
                                <TableAsync
                                    query={{
                                        model : 'node'
                                    }}
                                    header={[
                                        ['Nodo', 'Aireadores', 'Estado']
                                    ]}
                                    body={[
                                        'address', 'num', 'status'
                                    ]}
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
