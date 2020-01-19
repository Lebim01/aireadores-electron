import moment from 'moment'

export default [

    // hoy

    { 
        start_datetime : moment().hour(11).minute(0).format('YYYY-MM-DD HH:mm:ss'), 
        end_datetime : moment().hour(14).minute(30).format('YYYY-MM-DD HH:mm:ss'), 
        node_id : 1 
    },

    // ayer

    { 
        start_datetime : moment().subtract(1, 'day').hour(14).minute(0).format('YYYY-MM-DD HH:mm:ss'), 
        end_datetime : moment().subtract(1, 'day').hour(15).minute(0).format('YYYY-MM-DD HH:mm:ss'), 
        node_id : 1 
    },
    { 
        start_datetime : moment().subtract(1, 'day').hour(3).minute(30).format('YYYY-MM-DD HH:mm:ss'), 
        end_datetime : moment().subtract(1, 'day').hour(5).minute(30).format('YYYY-MM-DD HH:mm:ss'), 
        node_id : 1 
    },

    // antier

    { 
        start_datetime : moment().subtract(2, 'day').hour(6).minute(0).format('YYYY-MM-DD HH:mm:ss'), 
        end_datetime : moment().subtract(2, 'day').hour(11).minute(0).format('YYYY-MM-DD HH:mm:ss'), 
        node_id : 1 
    },
    { 
        start_datetime : moment().subtract(2, 'day').hour(15).minute(30).format('YYYY-MM-DD HH:mm:ss'), 
        end_datetime : moment().subtract(2, 'day').hour(20).minute(30).format('YYYY-MM-DD HH:mm:ss'), 
        node_id : 1 
    },
]