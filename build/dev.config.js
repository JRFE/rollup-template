const base = require('./base.config')
const rollup = require('rollup')
const ora = require('ora')
const path = require('path')
const logger = require('./plugins/logger')
const proxy = require('./plugins/proxy')
const postcss = require('rollup-plugin-postcss')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs =require('rollup-plugin-commonjs')
const copy = require('rollup-plugin-copy')
const html = require('./plugins/rollup-plugin-html')
var once = true

module.exports = {
    config: Object.assign(base, {
        plugins: [
            resolve(),
            postcss(),
            commonjs(),
            babel({
                exclude: 'node_modules/**'
            }),
            // 映射静态资源到目标目录
            copy({
                'src/assets': 'dist/assets'
            }),
            html({
                template: 'index.html'
            })
        ]
    }),
    watcher() {
        const watchOpts = Object.assign({
            include: ['src/**', 'app.js']
        }, base)
        const watcher = rollup.watch(watchOpts)
        var spinner = ora('开始')
        spinner.start()

        
        watcher.on('event', event => {
            switch (event.code) {
                case 'START':
                    spinner.stop()
                    spinner.text = '开始编译...'
                    spinner.start()
                    break
                case 'BUNDLE_END':
                    spinner.stop()
                    event.result.watchFiles.forEach(file => {
                        logger.success(path.resolve(__dirname, file))
                    })
                    break
                case 'END':
                    spinner.stop()
                    if (once) {
                        proxy()
                        once = false
                    }
                    break
                case 'FATAL':
                    spinner.stop()
                    console.log(event.error)
                    break
            }
        })
    }
}