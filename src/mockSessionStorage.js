const sessionStorageMock = (function () {
  let store = {}

  return {
    getItem: function (key) {
      return store[key] || null
    },
    setItem: function (key, value) {
      store[key] = value.toString()
    },
    clear: function () {
      store = {}
    },
  }
})()

export default () => {
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
  })
}
