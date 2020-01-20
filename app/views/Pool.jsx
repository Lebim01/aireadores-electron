import React, { useState, useEffect } from "react";
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
import models from 'models'
import EditPage from 'components/Catalog/EditPage'

const Pool = ({ match, history }) => {
  const [dataForm, setDataForm] = useState({ name : '' })

  const onChange = (e) => {
    setDataForm({
      ...dataForm,
      [e.target.name] : e.target.value
    })
  }

  return (
    <EditPage
      model="pool"
      route="/admin/piscinas"
      title="Crear/Editar Piscina"
      dataForm={dataForm}
      setDataForm={setDataForm}
      match={match}
      history={history}
    >
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
    </EditPage>
  );
}

export default Pool;
