import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Card, CardHeader, CardBody } from 'reactstrap'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import models from 'models'
import './MapNodes.css'

const MapNodes = (props) => {

    const map = useRef(null)

    const [data, setData] = useState([])

    const [viewport, setViewport] = useState({
        center: [51.505, -0.09],
        zoom: 13,
    })

    useEffect(() => {
        const getMap = async () => {
            const result = await models.node.findAll()
            const _data = result.map(record => ({
                latitude : record.latitude,
                longitude : record.longitude,
                device_id : record.device_id
            }))

            setData(_data)
        }
        getMap()
    }, [])

    const setBounds = () => {
        if(data.length === 0) return null
        
        let lats = [], lngs = []
        for (var i = 0; i < data.length; i++)  {
            lats.push(data[i].latitude);
            lngs.push(data[i].longitude);
        }
        console.log(lats, lngs)
        const minlat = Math.min.apply(null, lats), maxlat = Math.max.apply(null, lats);
        const minlng = Math.min.apply(null, lngs), maxlng = Math.max.apply(null, lngs);
        const bbox = [[minlat,minlng],[maxlat,maxlng]];
        console.log(bbox)
        return bbox
    }

    return (
        <>
            <Container fluid>
                <Row>
                    <Col className="mb-5 mb-xl-0">
                        <Card className="shadow" style={{minHeight: 300}}>
                            <CardHeader className="bg-secondary">
                                Mapa de nodos
                            </CardHeader>
                            <CardBody>
                                <Map 
                                    ref={map} 
                                    center={[51.505, -0.09]}
                                    zoom={13}
                                    bounds={setBounds()}
                                    boundsOptions={{padding: [50, 50]}}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
                                    />
                                    {data.map((row, i) => 
                                        <Marker position={[ row.latitude, row.longitude ]} key={i}>
                                            <Popup>#{row.device_id}</Popup>
                                        </Marker>
                                    )}
                                </Map>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default MapNodes
