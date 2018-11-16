const DB = require("../utils/db.js")

module.exports = {
  //创建订单
  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId

    //将用户openid作为user识别信息插入订单用户表
    let order = await DB.query("insert into order_user(user) values (?)", [user])

    let productList = ctx.request.body.list || []  //从中间件获取购买商品列表
    let isInstantBuy = !!ctx.request.body.isInstantBuy

    let orderId = order.insertId
    let sql = 'INSERT INTO order_product(order_id, product_id, count) VALUES '

    let needToDelQuery = []
    let needToDelIds = []

    let query = []
    let param = []

    productList.forEach(product => {
      query.push("(?, ?, ?)")

      param.push(orderId)
      param.push(product.id)
      param.push(product.count || 1)

      needToDelQuery.push("?")
      needToDelIds.push(product.id)
    })
    //创建以上订单商品表项
    await DB.query(sql + query.join(","), param)

    if (!isInstantBuy) {
      await DB.query('DELETE FROM trolley_user WHERE trolley_user.id IN (' + needToDelQuery.join(', ') + ') AND trolley_user.user = ?', [...needToDelIds, user])
      ctx.state.data = await DB.query('SELECT * FROM trolley_user LEFT JOIN product ON trolley_user.id = product.id WHERE trolley_user.user = ?', [user])
    }
  },
  list: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId

    let list = await DB.query("SELECT order_user.id AS `id`, order_user.user AS `user`, order_user.create_time AS `create_time`, order_product.product_id AS `product_id`, order_product.count AS `count`, product.name AS `name`, product.image AS `image`, product.price AS `price` FROM order_user LEFT JOIN order_product ON order_user.id = order_product.order_id LEFT JOIN product ON order_product.product_id = product.id WHERE order_user.user = ? ORDER BY order_product.order_id", [user])

    let res = []
    let cacheMap = {}
    let block = []
    let id = 0

    list.forEach(order => {
      if (!cacheMap[order.id]) {
        block = []
        res.push({
          id: ++id,
          list: block
        })
        cacheMap[order.id] = true
      }

      block.push(order)
    })

    ctx.state.data = res
  }
}