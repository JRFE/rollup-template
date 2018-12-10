/**
 * @author flyerjay
 * @desc 自动生成index.html
 */

const path = require('path')
const fs = require('fs')

function readFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(process.cwd(), file), (err, body) => {
            if (!err) {
                resolve(Buffer.from(body).toString('utf-8'))
            } else {
                resolve('')
            }
        })
    })
}

module.exports = function(options = {}) {
    const file = options.template
    const _template = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>rollup</title>
    </head>
    <body>
    </body>
    </html>`
    return {
        name: 'rollup-plugin-html',

        async onwrite (config) {
            var folder = config.file.split('/')[0]
            let template = await readFile(file) || _template
            template = template.replace(/<body>([\s\S]*)<\/body>/, (template, body) => {
                if (typeof config.file === 'array') {
                    return '<body>' +
                        body +
                        config.file.map(file => {
                            var src = path.relative(folder, file)
                            if (src.charAt(0) !== '.') {
                                src = './' + src
                            }
                            return `<script src="${src}"></script>`
                        }).join('\r\n') +
                    '</body>'
                } else {
                    var src = path.relative(folder, config.file)
                    if (src.charAt(0) !== '.') {
                        src = './' + src
                    }
                    return `<body>${body}<script src="${src}"></script></body>`
                }
            })
            const data = new Uint8Array(Buffer.from(template))
            await new Promise((resolve, reject) => {
                fs.writeFile('dist/index.html', data, function(err) {
                    if (!err) {
                        resolve()
                    } else {
                        reject(err)
                    }
                })
            })
        }
    }

    /**
     * rollup-plugin hooks 的执行顺序
     * resolveId -> load -> transform -> transformBundle -> ongenerate -> onwrite
     */
}