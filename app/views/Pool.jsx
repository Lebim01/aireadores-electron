import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  CardBody,
  Label,
  Button 
} from "reactstrap";
import Swal from 'sweetalert2'
import models from 'models'

const save = async (data) => {
  try {
    if(!data.name) throw new Error('IP es requerida')

    await models.pool.create(data)

    Swal.fire('Guardar', 'Guardado correctamente', 'success')
  }catch(err){
    Swal.fire('Guardar', err, 'error')
  }
}

const Pool = () => {

  const [dataForm, setDataForm] = useState({ name : '' })

  const onChange = (e) => {
    setDataForm({
      ...dataForm,
      [e.target.name] : e.target.value
    })
  }
  
  return (
    <>
      <Container fluid>
        <Row>
          <Col className="mb-5 mb-xl-0">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                Psicina
              </CardHeader>
              <CardBody>
                <Form>
                  <FormGroup row>
                    <Label sm={2}>Nombre</Label>
                    <Col sm={10} lg={6}>
                      <Input
                        type="text"
                        name="name"
                        onChange={onChange}
                        value={dataForm.name}
                      />
                    </Col>
                  </FormGroup>
                </Form>

                <Button color="success" onClick={() => save(dataForm)}>Guardar</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Pool;
