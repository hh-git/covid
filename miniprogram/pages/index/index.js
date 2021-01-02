// pages/team/team.js
var util = require('../../utils/utils.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show : 1,
    openid: '',
    team: '',
    name: '',
    number: '',
    isExsit :0,
    userId: '',
    isDone: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     // 调用函数时，传入new Date()参数，返回值是日期和时间
     var time = util.formatTime(new Date());
     // 再通过setData更改Page()里面的data，动态更新页面的数据
     this.setData({
       time: time
     });
     wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid;
        this.onQueryByOpenid();
      }
    });
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onQueryByOpenid: function() {
    const db = wx.cloud.database()
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        this.setData({
          team: res.data[0].team,
          name: res.data[0].name,
          number: res.data[0].number,
          isExsit: res.data.length,
          userId: res.data[0]._id,
          isDone: res.data[0].isDone
        })
        app.globalData.team=res.data[0].team
        app.globalData.userId=res.data[0]._id
        if(this.data.isDone){
          this.setData({
            show: 0
          })
        }else{
          this.setData({
            show: 1
          })
        }
      }
    })
  },
  onUpdate: function() {
    const db = wx.cloud.database()
    db.collection('user').doc(app.globalData.userId).update({
      data: {
        isDone: true
      },
      success: res => {
        this.onQueryByOpenid();
      },
      fail: err => {
      console.error('[数据库] [更新记录] 失败：', err)
    }
    })
  },
  onPullDownRefresh:function(){
    this.onQueryByOpenid();
    setTimeout(function(){
        wx.stopPullDownRefresh() //停止下拉刷新
    },1000);
  }
})