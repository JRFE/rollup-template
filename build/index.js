const rollup = require('rollup')
const dev = require('./dev.config')
const prod = require('./prod.config')
const config = process.env.NODE_ENV === 'product' ? prod : dev.config

if (process.env.NODE_ENV === 'product') {
    async function build() {
        const bundle = await rollup.rollup(config)
    
        const { code, map } = await bundle.generate(config.output)
    
        await bundle.write(config.output)
    }

    build()
} else {
    dev.watcher()
}

