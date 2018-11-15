const DB = require("../utils/db.js")

module.exports = {
  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let prouduct = ctx.request.body

    let list = await DB.query("SELECT * FROM trolley_user WHERE trolley_user.id = ? AND trolley_user.user = ?", [prouduct.id, user])
    if (!list.length) {
      // 商品还未添加到购物车
      DB.query('INSERT INTO trolley_user(id, count, user) VALUES (?, ?, ?)', [prouduct.id, 1, user])
    } else {
      // 商品之前已经添加到购物车
      let count = list.count + 1
      DB.query('UPDATE trolley_user SET count = ? WHERE trolley_user.id = ? AND trolley_user.user = ?', [count, prouduct.id, user])
    }
  },
  list: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    ctx.state.data = await DB.query('SELECT * FROM trolley_user LEFT JOIN product ON trolley_user.id = product.id WHERE trolley_user.user = ?', [user])
  }
}