import React from 'react'
import { Container, Row, Col, Card, CardHeader, CardBody } from 'reactstrap'
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  MonthView,
  DayView,
  WeekView,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
  ViewSwitcher
} from '@devexpress/dx-react-scheduler-material-ui';
import dataCalendar from './calendar-data'

const HistoryNodes = (props) => {
    return (
        <>
            <Container fluid>
                <Row>
                    <Col className="mb-5 mb-xl-0">
                        <Card className="shadow" style={{minHeight: 300}}>
                            <CardHeader className="bg-secondary">
                                Cread/Editar Nodo
                            </CardHeader>
                            <CardBody>
                                <Scheduler locale={'es-ES'} data={dataCalendar}>
                                    <ViewState defaultCurrentViewName="Semana" currentDate="2020-06-28" />
                                    <DayView name="Dia" />
                                    <WeekView name="Semana" />
                                    <MonthView name="Mes" />
                                    <Toolbar />
                                    <ViewSwitcher />
                                    <DateNavigator />
                                    <TodayButton />
                                    <Appointments />
                                </Scheduler>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default HistoryNodes