var config = {
  test: {
    scanpath: 'whoami',
    updatepath: 'whoami'
  },
  default: {
  	scanpath: '/root/artikscan/artikscan',
    updatepath: '/root/artik-connect/SEND'
  }
}

exports.get = function get(env) {
  return config[env] || config.default;
}