import React, { useState } from 'react'
import { Input } from 'reactstrap'
import { useFetchAsync } from 'hooks'

const SelectAsync = ({ children, query, ...props }) => {

    const { valueName, labelName, ...queryOptions } = query
    const { data, loading, error } = useFetchAsync(queryOptions)

    return (
        <Input type="select" {...props}>
            {children}
            { data && Array.isArray(data) && data.map((row, i) => 
                <option key={i} value={row[valueName]}>{row[labelName]}</option>
            )}
        </Input>
    )
}

export default SelectAsync