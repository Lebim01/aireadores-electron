import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button } from 'reactstrap'
import { useFetchAsync } from 'hooks'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

const TableAsync = ({ query, header, body, location, history }) => {
    const { data, loading, error } = useFetchAsync(query)

    const goEdit = (row = { id : 0 }) => {
        history.push(`${location.pathname}/${row.id}`)
    }

    return (
        <BlockUi tag="div" blocking={loading || error} message={error ? error : ''}>
            <div className="text-right">
                <Button size="sm" color="acent" onClick={() => goEdit()}>
                    Agregar <FontAwesomeIcon icon={faPlus} />
                </Button>
            </div>
            <div style={{padingTop: 30, minHeight: 200}}>
                <br/>
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