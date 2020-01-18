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
                                Listado de psicinas
                            </CardHeader>
                            <CardBody>
                                <TableAsync
                                    query={{
                                        model : 'pool'
                                    }}
                                    header={[
                                        ['Nombre']
                                    ]}
                                    body={[
                                        'name'
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
