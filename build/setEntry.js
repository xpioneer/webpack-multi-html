const Fs = require('fs')
const Path = require('path')

let _entryJS = [], _entryPage = []

function setEntry(path, _pre) {
  if(Fs.existsSync(path)) {
    Fs.readdirSync(path).forEach(dir => {
      const _path = path + '/' + dir
      // console.log(dir, '====', _path)
      if(Fs.statSync(_path).isDirectory()) {
        _pre = dir
        setEntry(_path, _pre)
      } else {
        if(dir.endsWith('.js')) {
          _entryJS.push({
            file: _path,
            dir: path,
            filename: (_pre ? _pre + '/' : '') + dir
          })
        }
        if(dir.endsWith('.html')) {
          _entryPage.push({
            file: _path,
            dir: path,
            filename: dir
          })
        }
      }
    })
  }
}


function init(_path) {
  
  const path = Path.join(process.cwd(), _path)

  console.log(path, `\n start read path: ${path}...\n `)

  setEntry(path)
  
  console.log('read file done. \n')

  _entryPage = _entryPage.map(htmlItem => {
    const chunks = _entryJS.filter(jsItem => jsItem.dir === htmlItem.dir).map(item => item.filename);
    htmlItem.chunks = chunks
    return htmlItem
  })

  let entryJS = {}, entryPage = []
  _entryJS.forEach(item => {
    entryJS[item.filename] = item.file
  })
  entryPage = _entryPage.map(item => {
    delete item.dir
    return item
  })

  return {
    entryJS,
    entryPage
  }
}

module.exports = init
