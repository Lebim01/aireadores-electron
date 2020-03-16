import { useState, useEffect } from 'react';
import models from 'models'

const emitter = require('electron').remote.getGlobal('sequelize-emitter')

export default function useFetchAsync({ model, ...query }) {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [error, setError] = useState('')

    const refresh = () => {
        setLoading(true)

        models[model].findAll({ ...query, raw: true })
        .then(result => {
            setData(result)
        })
        .catch(function (thrown) {
            setError("Algo fallo al consultar: " + thrown)
        })
        .finally(() => {
            setLoading(false)
        })

        emitter.on(`${model}-refresh`, () => {
            refresh()
        })
    }

    useEffect(() => {
        console.info('refresh')
        if(query){
            refresh()
        }
    }, [query.where, query.order]);

    return {
        error,
        loading,
        data,
        refresh
    }
}