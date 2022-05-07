/**
 * descript 
 * 
**/

class Vue {
  constructor(options){
    // data, menthods,computed,watch,
    this.$options = options || {}

    // 获取 data
    this.$data = options.data || {}

    this.$el =
    typeof options.el === 'string'
      ? document.querySelector(options.el)
      : options.el

    // vm._self = vm
    // initLifecycle(vm)
    // initEvents(vm)
    // initRender(vm)
    // callHook(vm, 'beforeCreate')
    // initInjections(vm) // resolve injections before data/props
    // initState(vm)
    // initProvide(vm) // resolve provide after data/props
    // callHook(vm, 'created')

    // 调用 _proxyData 处理 data中的属性
    this._proxyData(this.$data)
    // 使用 Obsever 把data中的数据转为响应式
    new Observer(this.$data)

    // if (vm.$options.el) {
    //   vm.$mount(vm.$options.el)
    // }
     // 编译模板
     new Compiler(this)
  }
  // 把data中的属性注册到vue
  _proxyData(data){
    console.log('data',data)
    //  new Observer(data)
    Object.keys(data).forEach((key) => {
      // 进行数据劫持
      // 把每个data的属性 到添加到 Vue 转化为 getter setter方法
      Object.defineProperty(this, key, {
        // 设置可以枚举
        enumerable: true,
        // 设置可以配置
        configurable: true,
        // 获取数据
        get() {
          return data[key]
        },
        // 设置数据
        set(newValue) {
          // 判断新值和旧值是否相等
          if (newValue === data[key]) return
          // 设置新值
          data[key] = newValue
        },
      })
    })
  }
}
