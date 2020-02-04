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
import Swal from 'sweetalert2'
import models from 'models'
import validateIP from 'validate-ip-node';

const save = async (data) => {
  try {
    if(!data.ip) throw new Error('IP es requerida')
    if(!validateIP(data.ip)) throw new Error('IP no valida')
    if(!data.port) throw new Error('Puerto es requerido')
    if(!data.username) throw new Error('Usuario es requerido')
    if(!data.key) throw new Error('Llave privada es requerida')

    const sshConfig = await models.ssh.findByPk(1)
    await sshConfig.update(data)

    Swal.fire('Guardar', 'Guardado correctamente', 'success')
  }catch(err){
    Swal.fire('Guardar', err.toString(), 'error')
  }
}

const Ssh = () => {

  const [dataForm, setDataForm] = useState({ ip : '', username : '', port : '', passphrase: '' })

  useEffect(() => {
    models.ssh.findOrCreate({ where: { id:1 } })
    .then(([res, isCreated]) => {
      if(res){
        const { dataValues: data } = res
        setDataForm(data)
      }
    })
  }, [])

  const onChange = (e) => {
    if(e.target.type === 'file'){
      let file = e.target.files[0]
      setDataForm({
        ...dataForm,
        [e.target.name] : file.path
      })
    }
    else {
      setDataForm({
        ...dataForm,
        [e.target.name] : e.target.value
      })
    }
  }
  
  return (
    <>
      <Container fluid>
        <Row>
          <Col className="mb-5 mb-xl-0">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                Configuración SSH
              </CardHeader>
              <CardBody>
                <Form>
                  <FormGroup row>
                    <Label sm={2}>Dirección IP</Label>
                    <Col sm={10} lg={6}>
                      <Input
                        type="ip"
                        name="ip"
                        onChange={onChange}
                        value={dataForm.ip}
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label sm={2}>Puerto</Label>
                    <Col sm={10} lg={6}>
                      <Input
                        type="text"
                        name="port"
                        onChange={onChange}
                        value={dataForm.port}
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label sm={2}>Usuario</Label>
                    <Col sm={10} lg={6}>
                      <Input
                        type="text"
                        name="username"
                        onChange={onChange}
                        value={dataForm.username}
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label sm={2}>Clave</Label>
                    <Col sm={10} lg={6}>
                      { dataForm.key &&
                        <span>
                          {dataForm.key}
                        </span>
                      }
                      <Input
                        type="file"
                        name="key"
                        onChange={onChange}
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label sm={2}>Passphrase</Label>
                    <Col sm={10} lg={6}>
                      <Input
                        type="password"
                        name="passphrase"
                        onChange={onChange}
                        value={dataForm.passphrase}
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

export default Ssh;
