/**
 * Dep 实际上就是对 Watcher 的一种管理，Dep 脱离 Watcher 单独存在是没有意义的
 */
class Dep{
  // 特别注意
  // 静态属性 target，全局唯一 Watcher，这是一个非常巧妙的设计，
  // 因为在同一时间只能有一个全局的 Watcher 被计算，另外它的自身属性 subs 也是 Watcher 的数组
  static target
  constructor(){
    this.subs = []  // 收集依赖(wartcher)数组
  }
  addSub(sub){
    this.subs.push(sub)
  }
  removeSub (sub) {
    // remove(this.subs, sub)
  }
  depend (){
    if(Dep.target){
      Dep.target.addSub(this)
    }
  }
  notify(){
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

Dep.target = null