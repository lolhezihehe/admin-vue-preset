<template>
  <div class="lw-editor" :class="'lw-editor--' + type">
    <div ref="tools" class="lw-editor__tools"></div>
    <div ref="content" class="lw-editor__content"></div>
  </div>
</template>

<script>
import config from "@/config";
import E from 'wangeditor'
export default {
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'normal'
    }
  },
  data() {
    return {
      editor: null,
      editorContent: '',
      lightMenus: [
        'emoticon',  // 表情
        'image',  // 插入图片
        'video',  // 插入视频
      ],
      normalMenus: [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        'emoticon',  // 表情
        'image',  // 插入图片
        'video',  // 插入视频
        'table',  // 表格
        // 'code',  // 插入代码
        'undo',  // 撤销
        'redo'  // 重复
      ]
    }
  },
  methods: {
    getTextContent(n = 100) {
      let text = this.editor.txt.text().replace(/\s+/g, '');
      return text;
    },
    getEditorContent() {
      return this.editor.txt.html();
    },
    setEditorContent(value) {
      this.editor.txt.html(value);
    },
  },
  mounted() {
    this.editor = new E(this.$refs.tools, this.$refs.content);
    this.editor.customConfig.menus = this.type === 'light' ? this.lightMenus : this.normalMenus;
    this.editor.customConfig.emotions = [{
      // tab 的标题
      title: 'emoji',
      // type -> 'emoji' / 'image'
      type: 'emoji',
      content: '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😓 😪 😴 🙄 🤔 😬 🤐'.split(/\s/)
    }]
    this.editor.customConfig.uploadImgServer = config.apiUrl + '/api/file/upload'; // 上传图片到服务器
    this.editor.customConfig.uploadFileName = 'file';	// 上传接口body文件参数名为file
    this.editor.customConfig.uploadImgHooks = {
      customInsert: function (insertImg, result, editor) {
        const url = result.content.fileUrl;
        insertImg(url);
      }
    }
    this.editor.customConfig.onchange = () => {
      this.$emit('input', this.getEditorContent())
    }
    this.editor.create();
  },
  watch: {
    value: function () {
      if (this.editor !== null && this.value !== this.getEditorContent()) {
        this.setEditorContent(this.value);
      }
    },
  },
}
</script>

<style lang="scss">
.lw-editor {
  position: relative;
  line-height: 1.5;
  font-size: 16px;
  z-index: 3;
}
.lw-editor__tools {
  background-color: #f9f9f9;
  border: 1px solid #dadada;
  border-bottom: none;
  font-size: 14px;
}
.lw-editor__content {
  border: 1px solid #dadada;
  height: 400px;
}
.lw-editor--light {
  .lw-editor__content {
    height: 200px;
  }
  // 源代码插入框居中  light css设成左侧保证在tool下方
  .w-e-panel-container {
    left: -1px;
    transform: translateX(50%);
  }
}
</style>