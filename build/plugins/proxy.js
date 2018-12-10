const server = require('live-server')

const config = {
    port: 8081,
    host: 'localhost',
    root: 'dist/',
    wait: 1000,
    logLevel: 2,
    proxy: [
        
    ]
}

module.exports = function(opts) {
    return server.start(Object.assign(config, opts))
}