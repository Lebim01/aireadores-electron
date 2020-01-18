import React, { useEffect } from 'react'
import { Container, Row, Col, Card, CardHeader, CardBody, Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import models from 'models'
import Swal from 'sweetalert2'

const EditPage = ({ children, match, history, route, model, title, dataForm, setDataForm }) => {

    useEffect(() => {
        async function getDataForm(id){
            const { dataValues } = await models[model].findByPk(id)
            const { updatedAt, createdAt, ...data } = dataValues
            setDataForm(data)
        }
    
        if(match.params.id && Number(match.params.id) > 0){
            getDataForm(Number(match.params.id))
        }
    }, [])

    const goBack = () => {
        history.push(route)
    }

    const save = async () => {
        try {
            const { id, ...fieldsToCreate } = dataForm
            if(id){
                const instance = await models[model].findByPk(id)
                Object.assign(instance, fieldsToCreate)
                const valid = await instance.validate()
                await instance.save()
            }else{
                const instance = models[model].build(fieldsToCreate)
                await instance.validate()
                await instance.save()
            }
            Swal.fire('Guardar', 'Guardado correctamente', 'success')
            goBack()
        }catch(err){
            Swal.fire('Guardar', `${err.errors.map(({message}) => message).join('<br>')}`, 'error')
        }
    }

    const remove = async () => {
        try {
            const { value } = await Swal.fire({
                title: '¿Esta seguro de eliminar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
            })
            if(value){
                await models[model].destroy({ where : { id : Number(match.params.id) } })
                Swal.fire('Eliminar', 'Eliminado correctamente', 'success')
                goBack()
            }
        }catch(err){
            console.error(err)
            Swal.fire('Eliminar', err, 'error')
        }
    }

    return (
        <>
            <Container fluid>
                <Row>
                    <Col className="mb-5 mb-xl-0">
                        <Card className="shadow">
                            <CardHeader className="bg-transparent">
                                {title}
                            </CardHeader>
                            <CardBody>
                                {children}
                                <hr />
                                <Button color="secondary" onClick={goBack}>
                                    <FontAwesomeIcon icon={faArrowLeft} /> Regresar
                                </Button>
                                <Button color="success" onClick={save}>Guardar</Button>
                                { Number(match.params.id) > 0 &&
                                    <Button color="danger" onClick={remove}>Eliminar</Button> 
                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default EditPage