var config = {
  test: {
    scanpath: 'whoami',
    updatepath: 'whoami'
  },
  default: {
  	scanpath: '/root/PROGRAMS/ARTIK5-BLE-SCAN/SCAN',
    updatepath: '/root/PROGRAMS/ARTIK5-BLE-CONNECT/SEND'
  }
}

exports.get = function get(env) {
  return config[env] || config.default;
}
