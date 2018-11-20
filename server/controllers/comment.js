const DB = require("../utils/db.js")

module.exports = {
  add: async ctx => {
    let userId = ctx.state.$wxInfo.userinfo.openId
    let username = ctx.state.$wxInfo.userinfo.nickName
    let userAvatar = ctx.state.$wxInfo.userinfo.avatarUrl
    let comment = ctx.request.body
    let content = comment.content || null
    let images = comment.images.join(";;") || ""
    let product_id = +comment.product_id

    if (!isNaN(product_id)) { 
      await DB.query("INSERT INTO comment(user, username, avatar, content, images, product_id) VALUES (?, ?, ?, ?, ?, ?)", [userId, username, userAvatar, content, images, product_id])
    }
    
    ctx.state.data = {}
  },
  list: async ctx => {
    let product_id = +ctx.request.query.product_id

    if (!isNaN(product_id)) { 
      ctx.state.data = await DB.query("SELECT * FROM comment WHERE comment.product_id=? ORDER BY create_time DESC", [product_id])
    }
  }
}