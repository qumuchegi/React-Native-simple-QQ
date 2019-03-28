import axios from 'axios'
import qs from 'querystring'

let url = "http://localhost:3003" 
 
export default {
    async get(route='/', data={}) {
        console.log(axios)
        let params = qs.stringify( data )
        if(params) params = '?' + params
        return this.apiResponse( await axios.get( url + route + params ))
    },
    async post(route='/', data = {},config,) {
        return this.apiResponse( await axios.post( url + route, data, config ))
    },
    apiResponse(res) {
        let {status, data} = res
        console.log( "status", status, 'data', data);
        return data
    }
}