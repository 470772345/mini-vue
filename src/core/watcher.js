

 class Watcher {
   // 将 Dep.target 指向自己
   // 然后触发属性的 getter 添加监听
   // 最后将 Dep.target 置空
  constructor(obj,key,cb){
     Dep.target = this
     this.cb = cb  // cb 回调函数 更新视图的具体方法
     this.obj = obj
     this.key = key
     this.value = obj[key]
     // 重置
     Dep.target = null
  }
  update() {
    console.log('update')
   // 获得新值
   this.value = this.obj[this.key]
   // 调用 update 方法更新 Dom
   this.cb(this.value)
  }
}