import request from "@/utils/request";

const MainApi = {
    // 一键查询
  getOneKeyInterface(data: any) {
    return request({
      url: "/getOneKeyInterface",
      method: "GET",
      data: data,
    });
  },
  // ocr识别身份证信息
   getIdCardInfo(data: any) {
    return request({
      url: "/getIdCardInfo",
      method: "POST",
      data: data,
      header: {
        'Content-Type': 'multipart/form-data'
      },
    });
  },
  // 根据银行卡号回显客户信息
  getBasicInfoList(data: any) {
    return request({
      url: "/getBasicInfoList",
      method: "GET",
      data: data,
    });
  },
  // 三要素不匹配说明
  saveUnMatchedDesc(data: any) {
    return request({
      url: "/saveUnMatchedDesc",
      method: "GET",
      data: data,
    });
  },
  // 云互联结果反馈
  interCloudFeedBack(data: any) {
    return request({
      url: "/interCloudFeedBack",
      method: "GET",
      data: data,
    });
  },
  // 
  getSaveInterCloudDesc(data: any) {
    return request({
      url: "/saveInterCloudDesc",
      method: "GET",
      data: data,
    });
  },
  // 两卡风险取现业务，取现异常反馈
  riskVerifyQxFeedback(data: any) {
    return request({
      url: "/riskVerifyQxFeedback",
      method: "GET",
      data: data,
    });
  },
  // 异常数详情
  getAccountControlDetail(data: any) {
    return request({
      url: "/getAccountControlDetail",
      method: "GET",
      data: data,
    });
  },
    // 营销弹窗展示产品类、指标类信息
  getMktInfoList(data: any) {
    return request({
      url: "/getMktInfoList",
      method: "GET",
      data: data,
    });
  },
  // 可疑账户共享数据-保存
  saveDoubtListShare(data: any) {
    return request({
      url: '/saveDoubtListShare',
      method: "GET",
      data: data
    })
  },
    //人工核实保存
  saveManualVerifyInfo(data: any) {
    return request({
      url: '/saveManualVerifyInfo',
      method: 'GET',
      data: data
    })
  },
}
export default MainApi;