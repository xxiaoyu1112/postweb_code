const amap_api_prefix = '/AmapApi'
const AmapWebApiKey = '0bb02285f619fae7c3f7b1ad6a735205'
export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({

    GET_GEO_ENCODING(location = [120.180031, 30.322666]) {
        let caller = '/v3/geocode/regeo?output=json&location=' + location[0].toString() + ',' + location[1].toString() + ',&key=' + AmapWebApiKey + '&radius=0extensions=all'
        let resp = request({
            url: amap_api_prefix + caller,
            method: 'get'
        })
        return resp
    },
    GET_GEO_ENCODINGS(locations = [
        [120.180031, 30.322666]
    ]) {
        return Promise.all(locations.map(async location => {
            return this.GET_GEO_ENCODING(location) // 返回一个Promise 给其返回
        }))
    }
})