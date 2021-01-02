// pages/userConsole/userConsole.js
Page({

  data: {
    openid: '',
    team: '',
    name: '',
    number: '',
    show: 0,
    isExsit :0,
    userId: '',
  },

  onLoad: function (options) {
    this.setData({
      openid: getApp().globalData.openid,
      userId: getApp().globalData.userId
    })
    this.onQueryByOpenid();
  },
  formSubmit: function(e) {
    this.setData({
      form: e.detail.value
    })
    var form = this.data.form;
    const db = wx.cloud.database()
    if(this.data.isExsit>0){
      db.collection('user').doc(this.data.userId).update({
        data: {
          team: form.team,
          name: form.name,
          number: form.number,
        },
        success: res => {
          this.setData({
            team: form.team,
            name: form.name,
            number: form.number,
            show: 0
          })
          getApp().globalData.team=this.data.team
        }
      })
    }else{
      db.collection('user').add({
        data: {
          team: form.team,
          name: form.name,
          number: form.number,
          isDone: false
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          this.setData({
            team: form.team,
            name: form.name,
            number: form.number,
            show: 0
          })
          getApp().globalData.team=this.data.team
          wx.showToast({
            title: '保存成功',
          })
        }
      })
    }
  },
  bindInput: function() {
    this.setData({
      show: 1
    })
  },
  
  onQueryByOpenid: function() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('user').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          team: res.data[0].team,
          name: res.data[0].name,
          number: res.data[0].number,
          isExsit: res.data.length,
          userId: res.data[0]._id
        })
        getApp().globalData.team=res.data[0].team
        getApp().globalData.userId=res.data[0]._id
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
