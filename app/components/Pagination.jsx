import React from 'react'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap'
import { useEffect } from 'react'

const getElementsFromNumber = (num) => {
    return new Array(num).fill(0)
}

const _Pagination = ({ pages, current, perPage, ...props }) => {

    const changePagination = (page, perPage) => {
        if(page == 0){
            props.setPaginationOptions({
                limit : perPage
            })
        }else{
            props.setPaginationOptions({
                offset : page * perPage,
                limit : perPage
            })
        }
    }

    const next = (e) => {
        e.preventDefault()
        changePagination(current+1, perPage)
        if(current+1 < pages) props.setPage(current+1)
    }

    const prev = (e) => {
        e.preventDefault()
        changePagination(current-1, perPage)
        if(current-1 >= 0) props.setPage(current-1)
    }

    return (
        <Pagination size="sm" aria-label="Page navigation example">
            <PaginationItem>
                <PaginationLink previous onClick={prev} />
            </PaginationItem>
            {getElementsFromNumber(pages).map((_, index) => 
                <PaginationItem active={index==current}>
                    <PaginationLink>
                        {index+1}
                    </PaginationLink>
                </PaginationItem>
            )}
            <PaginationItem>
                <PaginationLink next onClick={next} />
            </PaginationItem>
        </Pagination>
    )
}

_Pagination.defaultProps = {
    pages : 1
}

export default _Pagination