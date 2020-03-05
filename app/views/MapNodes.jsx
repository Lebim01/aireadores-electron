import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Card, CardHeader, CardBody } from 'reactstrap'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
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
            const result = await models.node.findAll({
                include: [
                    { model: models.pool }
                ],
            })
            const _data = result.filter(record => record.latitude && record.longitude).map(record => ({
                latitude : record.latitude,
                longitude : record.longitude,
                device_id : record.device_id,
                channel: record.channel,
                address: record.address,
                pool_name: record.pool ? record.pool.name : 'N/A',
            }))

            setData(_data)
        }
        getMap()
    }, [])

    const setBounds = (coords) => {
        if(coords.length === 0) return null
        
        let lats = [], lngs = []
        for (var i = 0; i < coords.length; i++){
            if(coords[i].latitude && coords[i].longitude){
                lats.push(coords[i].latitude);
                lngs.push(coords[i].longitude);
            }
        }
        const minlat = Math.min.apply(null, lats), maxlat = Math.max.apply(null, lats);
        const minlng = Math.min.apply(null, lngs), maxlng = Math.max.apply(null, lngs);
        const bbox = L.latLngBounds(
            L.latLng(minlat, minlng),
            L.latLng(maxlat, maxlng)
        )
        
        const zoom = map.current.leafletElement.getBoundsZoom(bbox)
        
        return {
            center : bbox.getCenter(),
            zoom : isFinite(zoom) ? zoom : 18
        }
    }

    const center = setBounds(data)

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
                                    center={data.length > 0 && center ? center.center : [51.505, -0.09]}
                                    zoom={data.length > 0 && center ? center.zoom : 13}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
                                    />
                                    {data.map((row, i) => 
                                        <Marker position={[ row.latitude, row.longitude ]} key={i}>
                                            <Popup>Dirección: {row.address} Canal: {row.channel} Identificador: {row.device_id} Piscina: {row.pool_name} </Popup>
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
