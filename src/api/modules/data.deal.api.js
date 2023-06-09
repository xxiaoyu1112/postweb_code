const data_prefix = '/data'
export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
    GET_DEALS(region, dealDate, pageNum = 0, PageSize = 10) {
        // pageNum -= 1
        // console.log('in');
        // let caller = '?deal_region=' + region + '&deal_date=' + dealDate + '&page_num=' + pageNum + '&page_size=' + PageSize //'/' + dataSource + '/' + dealId + '?pageNum=' + pageNum.toString() + '&pageSize=' + PageSize.toString()
        let resp = request({
            url: data_prefix + '/data/predict',
            method: 'post',
            data: {
                "deal_region": region,
                "deal_date": dealDate,
                "page_num": pageNum,
                "page_size": PageSize
            }
        })
        return resp
    },

    GET_RAW_DEAL_TREE() {
        let resp = request({
            url: data_prefix + '/data/raw/tree/',
            method: 'get',
        })
        return resp
    },
    GET_POSTMANID(prefix) {
      let resp = request({
        url: data_prefix + '/data/postmanId',
        method: 'post',
        data: {
          "prefix": prefix,
        }
      })
      return resp
    },
    GET_POSTMAN_WORKDATE(postman_id) {
      let resp = request({
        url: data_prefix + '/data/postmanDate',
        method: 'post',
        data: {
          "postman_id": postman_id,
        }
      })
      return resp
    },
    GET_RAW_DEAL(tag, source, pageSize, pageNum) {
        pageNum--
        let resp = request({
            url: data_prefix + '/data/raw/',
            method: 'post',
            data: {
                "tag": tag,
                "source": source,
                "page_size": pageSize,
                "page_num": pageNum
            }
        })
        return resp
    },
    GET_POSTMAN_RAW_DATA(postmanId, postmanDate) {
        let resp = request({
            url: data_prefix + '/data/postmanRawData',
            method: 'post',
            data: {
              "postman_id": postmanId,
              "postman_workday": postmanDate,
            }
          })
        return resp
    },
    GEN_PREDICT_DEAL(tag) {
        let resp = request({
            url: data_prefix + '/task/gen/' + tag,
            method: 'post',
        })
        return resp
    },
    GET_GEN_TASK(taskId) {

        let resp = request({
            url: data_prefix + '/task/gen/' + taskId,
            method: 'get',
        })
        return resp
    }
})
