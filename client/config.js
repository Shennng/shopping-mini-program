/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://6gq9v6v6.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`,

        // 获取所有商品数据接口
        productListUrl: `${host}/weapp/product`,

        //获取单个商品数据接口
        productDetail: `${host}/weapp/product/`,

        //创建订单接口
        orderUrl: `${host}/weapp/order`,

        //提交到购物车
        trolleyUrl: `${host}/weapp/trolley`,

        //评价相关
        commentUrl: `${host}/weapp/comment`
    }
};

module.exports = config;
