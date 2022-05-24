const manage_prefix = '/model/manage'
export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
    /**
     * @description 请求模型数据
     * @param {Object} data 登录携带的信息
     */
    GET_REGISTER_MODELS(data = {}) {
        // 接口请求
        return request({
            url: manage_prefix + '/models',
            method: 'get',
            data
        })
    },
    GET_MODEL_DETAIL() {
        return request({
            url: manage_prefix + '/model/states',
            method: 'get'
        })
    },
    UNREGISTER_MODEL(name = '', version = '') {
        return request({
            url: manage_prefix + '/model/' + name + '/' + version,
            method: 'delete'
        })
    },
    UPDATE_MODEL(name = '', version = '', minWorkers = 0, maxWorkers = 0) {
        return request({
            url: manage_prefix + '/model/' + name + '/' + version,
            method: 'post',
            data: {
                "min_workers": minWorkers,
                "max_workers": maxWorkers,
            }
        })
    },
    // 暂时卸载管理js中 仅仅包含一个方法
    PREDICT_MODEL(name = '', version = '', start = 0, feature = []) {
        return request({
            url: manage_prefix + '/model/' + name + '/' + version,
            method: 'put',
            data: {
                feature,
                start
            }
        })
    },
})