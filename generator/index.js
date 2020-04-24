function replaceFiles(api) {
  // 替换文件
  const files = {
    'src/.eslintrc.js': './templates/base/_eslintrc.js',
    'src/main.js': './templates/base/src/main.js',
    'src/App.vue': './templates/base/src/App.vue'
  }
  api.render(files);
}

function deleteFiles(api) {
  // 删除原生成文件
  const oriFiles = [
    'src/views/About.vue',
    'src/components/HelloWorld.vue',
  ]
  // https://github.com/vuejs/vue-cli/issues/2470
  api.render(files => {
    return Object.keys(files)
      .filter(name => oriFiles.indexOf(name) > -1)
      .forEach(name => delete files[name])
  })
}

function hasEditor(api, opts) {
  if (opts.editor) {
    api.extendPackage({
      dependencies: {
        "wangeditor": "^3.1.1"
      }
    })
    api.render('./templates/editor');
  }
}

module.exports = (api, opts) => {

  api.extendPackage({
    dependencies: {
      "normalize.css": "^8.0.1",
      // "remixicon": "^2.3.0",
      // "lockr": "^0.8.5",
      // "nprogress": "^0.2.0",
      // 'axios': '^0.18.1',
      // 'element-ui': '^2.13.0',
      // "dayjs": "^1.8.22",
      // "lodash": "^4.17.15",
    },
    scripts: {
      "dev": "vue-cli-service serve",
      'test-build': 'vue-cli-service build --mode staging'
    }
  })

  deleteFiles(api);

  replaceFiles(api);

  api.render('./templates/base');

  hasEditor(api, opts);
}