import { useState, useEffect } from 'react';
import models from 'models'

export default function useFetchAsync({ model, ...query }) {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        if(query){
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
        }
    }, [query.where, query.order]);

    return {
        error,
        loading,
        data
    }
}