import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'reactstrap'
import { useFetchAsync } from 'hooks'

import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

const TableAsync = ({ query, header, body }) => {

    const { data, loading, error } = useFetchAsync(query)

    const goEdit = (row) => {
        //history.push(`${row.id}`)
    }

    return (
        <BlockUi tag="div" blocking={loading || error} message={error ? error : ''}>
            <div style={{padingTop: 30, minHeight: 200}}>
                <Table striped hover>
                    <thead>
                        { header.map((rowHead, i) => 
                            <tr key={i}>
                                {rowHead.map((colHead, j) => 
                                    <th key={j}>{colHead}</th>
                                )}
                            </tr>
                        ) }
                    </thead>
                    <tbody>
                        { data && Array.isArray(data) && data.map((row, i) => 
                            <tr key={i} onDoubleClick={() => goEdit(row)}>
                                {body.map((col, j) => 
                                    <td key={j}>{row[col]}</td>
                                )}
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </BlockUi>
    )
}

TableAsync.defaultProps = {
    data : [],
    blockui : true
}

TableAsync.propTypes = {
    data : PropTypes.array,
    blockui : PropTypes.bool
}

export default TableAsync