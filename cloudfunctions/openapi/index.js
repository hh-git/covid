// 使用了 async await 语法
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  console.log('定时任务1')
  try {
    return await db.collection('user').where({
      isDone: true
    })
    .update({
      data: {
        isDone: false
      },
    })
  } catch(e) {
    console.error(e)
  }
}