// 这个是单独的 !!!!!
// 类MVVM 模式
// 1. 对data的劫持 defindProperty
// 2. watch 对象
// 3. 需要监听的 data 存放依赖  依赖管理器---class Dep
// 4  发布订阅  先监听, 有变化就 notice 通知去对应改变.


let testData = {
  a:'茶叶蛋',
  b:'茶'
}

const test1 = '蛋'
/**
 * Observer类会通过递归的方式把一个对象的所有属性都转化成可观测对象
 */
class Observer {
    constructor(value) {
      this.value = value
      if(Array.isArray(value)){
        console.log('走数组的逻辑')
      }else{
        this.walk(value)
      }
    }
    walk(obj){
      for(var [key,val] of Object.entries(obj)){
        defindReactive(obj,key)
      }
    }
}
/**
 * 使一个对象转化成可观测对象
 * @param { Object } obj 对象
 * @param { String } key 对象的key
 * @param { Any } val 对象的某个key的值
 */
function defindReactive(obj,key,val) {
     
        console.log(key,'---',val)
        
        // 如果只传了obj和key，那么val = obj[key]
        if (arguments.length === 2) {
          val = obj[key]
        }
        console.log(val)
        
        // 如果是对象 继续递归
        if(typeof val === 'object'){
           new Observer(val)
        }
      
      const dep = new Dep()

      Object.defineProperty(obj,key,{
          enumerable : true,
          configurable : true,
          get(){
              console.log('get',val)
              dep.depend()
              return val
          },
          set(newVal){
               if(val === newVal){
                  return
               }
               console.log('set')
               console.log(newVal)
               val = newVal
               dep.notify()
          },
         }
      )
}

class Dep {
   static target
   constructor(){
      this.subs = []
   }
   addSub(sub){
     this.subs.push(sub)
   }
   removeSub(sub){
     remove(this.subs,sub)
   }
   // 
   depend() {
       console.log('Dep.target',Dep.target)
       // 将 Watcher 添加到订阅 , 用一个全局唯一 target 来存watch 也是一个优化点
       if(Dep.target){
         this.addSub(Dep.target)
       }
   }
   notify(){
     const subs = this.subs.slice()
     for(let i= 0 , l = subs.length; i < l; i++){
         console.log('更新...')
         subs[i].update()
     }
   }
}

// 全局属性，通过该属性配置 Watcher
Dep.target = null

function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

class Watcher {
   constructor(obj,key,cb){
     // 将 Dep.target 指向自己
     // 然后触发属性的 getter 添加监听
     // 最后将 Dep.target 置空
      Dep.target = this
      this.cb = cb
      this.obj = obj
      this.key = key
      this.value = obj[key]
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

function update(value) {
  console.log('update, 模拟更新 dom节点')
  document.querySelector('div').innerText = value
}

const data = {
  'name':'茶叶蛋',
  'age':18
}
let car = new Observer(data)

new Watcher(data, 'name', update)

data.name = '茶叶蛋111'

// 面试回答术语
// 谈谈你对 vue 的 MVVM 响应式原理的理解。
// Vue 是采用数据劫持结合发布订阅模式的方式，通过 Object.defineProperty（）来劫持各个属性的 getter，setter，在数据变动时发布消息给订阅者，然后触发相应的监听回调函数来更新视图。
// 需要 Observer 对数据进行递归遍历，包括子属对象的属性，都添加上 getter、setter，当读取值或者修改数据的时候，就会 触发getter 或 setter，就能够监听到数据变化。
// Compile 解析指令，初始化页面将模板中的变量替换成数据，并将每个指令对应的节点绑定更新的回调函数，添加订阅者，一旦数据变动，订阅者收到通知，触发回调更新视图。
// Watcher 是 Observer 和 Compile 之间的桥梁，首先，需要在自身实例时往 dep 中添加自己，其次，要有一个 update方法 更新，最后，数据变动时触发 dep.notify方法，调用自身的 update方法，触发 Compile 中绑定的回调函数。
// MVVM 作为数据绑定的入口，整合Observer、Compile 和 Watcher 三者，
// 通过 Observer 来监听自己的 model 数据变化，通过 Compile 来解析指令，最终利用Watcher 搭起 Observer 和 Compile 之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化（input） -> 数据model更新的双向绑定效果。

// 作者：青峰10
// 链接：https://juejin.cn/post/7070428912953753607
// 来源：稀土掘金
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。