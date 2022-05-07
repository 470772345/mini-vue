// import { Dep } from "./dep"
/**
 * @description Observer类会通过递归的方式把一个对象的所有属性都转化成可观测对象
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
 class Observer {
   constructor(value){
     console.log('Observer')
     this.value = value
     // 用来收集依赖
     this.dep = new Dep()
     if(Array.isArray(value)){
       this.observeArray(value)
     }else{
       this.walk(value)
     }
   }
   // 处理对象的,添加setter getter
   walk(obj){
       const keys = Object.keys(obj)
       for(let i=0,l=keys.length;i<l;i++){
          defindReactive(obj,keys[i])
       }
   }
  /**
   * Observe a list of Array items.
   */
  observeArray (items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
/**
 * @description 定义一个响应式对象，给对象动态添加 getter 和 sette
 * @param {*} obj 
 * @param {*} key 
 * @param {*} val 
 **/
function defindReactive(obj,key,val){
  const property = Object.getOwnPropertyDescriptor(obj, key)
  // 如果属性不给编辑 return
  if (property && property.configurable === false) {
    return
  }
  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  const dep = new Dep()

  Object.defineProperty(obj,key,{
    enumerable:true,
    configurable:true,
    get:function reactiveGetter(){
      const value = getter ? getter.call(obj) : val
      console.log('get-->',value)
      // 收集依赖
      if (Dep.target) {
        dep.depend()
      }
       return value
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val
      // 兼容判断 nan
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      // 派发更新
      dep.notify()
    }
  })
}