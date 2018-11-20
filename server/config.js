const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
    appId: 'wx61f44d85f30626bb',

    // 微信小程序 App Secret
    appSecret: '3f18b3b943558607d5a478ba91687eaa',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: true,

    qcloudAppId: '1258005074',
    qcloudSecretId: 'AKIDFMHzUnkqY2HI5eP6zd2A3i7G9mAIpoBI',
    qcloudSecretKey: '0lHYaPzJNBk36tRjmdGfqnW1HJ6g292h',

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        pass: 'wx61f44d85f30626bb',
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-guangzhou',
        // Bucket 名称
        fileBucket: 'commentimage',
        // 文件夹
        uploadFolder: ''
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh'
}

module.exports = CONF
