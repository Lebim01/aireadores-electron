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

const Pools = (props) => {
    return (
        <>
            <Container fluid>
                <Row>
                    <Col className="mb-5 mb-xl-0">
                        <Card className="shadow" style={{minHeight: 300}}>
                            <CardHeader className="bg-secondary">
                                Listado de piscinas
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
                                    location={props.location}
                                    history={props.history}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Pools;
