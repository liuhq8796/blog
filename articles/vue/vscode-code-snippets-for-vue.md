# 适用于 vue 的 VSCode 代码片段

```json
{
  "Vue SFC Template": {
    "prefix": "sfc",
    "body": [
      "<script setup lang=\"${1:ts}\">",
      "$5",
      "</script>",
      "",
      "<template>",
      "  <div class=\"${2:class}\"></div>",
      "</template>",
      "",
      "<style scoped${3: lang=\"${4:scss}\"}>",
      ".${2:class} {}",
      "</style>"
    ],
    "description": "初始化 vue3 SFC 模板"
  },
  "Vue Define Props": {
    "prefix": "props",
    "body": ["const props = withDefaults(defineProps<{", "  $1", "}>(), {", "  $2", "})"],
    "description": "初始化 vue3 props 定义"
  },
  "Vue Define Emits": {
    "prefix": "emits",
    "body": ["const emit = defineEmits<{", "  $1: [$2: $3]", "}>()"],
    "description": "初始化 vue3 emits 定义"
  }
}
```

分享博文：

[VSCode 利用 Snippets 设置超实用的代码块](https://juejin.cn/post/6844903869424599053)

在线工具：

[代码块生成工具 snippet generator](https://snippet-generator.app/)
