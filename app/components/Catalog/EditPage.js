import React, { useEffect } from 'react'
import { Container, Row, Col, Card, CardHeader, CardBody, Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import models from 'models'
import Swal from 'sweetalert2'

const EditPage = React.forwardRef(({ children, match, history, route, model, title, dataForm, setDataForm, ...props }, ref) => {
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

    const save = async (showModal = true) => {
        try {
            Swal.fire('Guardando')
            Swal.showLoading()

            const { id, ...fieldsToCreate } = dataForm

            if(props.onBeforeSave){
                let valid = await props.onBeforeSave(dataForm)
                if(!valid)
                    throw 'No se pudo guardar'
            }

            let instance
            if(id){
                instance = await models[model].findByPk(id)
                Object.assign(instance, fieldsToCreate)
                await instance.validate()
                await instance.save()
            }else{
                instance = models[model].build(fieldsToCreate)
                await instance.validate()
                await instance.save()
            }

            if(props.onSave)
                await props.onSave(instance)

            if(showModal)
                Swal.fire('Guardar', 'Guardado correctamente', 'success')

            if(!props.noRedirect) goBack()
        }catch(err){
            console.error(err)
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
            Swal.fire('Eliminar', 'El registro está en uso, no puede ser eliminado', 'error')
        }
    }

    if(ref){
        ref.current = {
            save
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
                                <Button color="success" onClick={save} {...props.btnSave}>Guardar</Button>
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
})

EditPage.defaultProps = {
    noRedirect : false,
    btnSave : {}
}

export default EditPage
