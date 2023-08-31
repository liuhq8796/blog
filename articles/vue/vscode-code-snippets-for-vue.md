# 适用于 vue 的 VSCode 代码片段

```json
{
  "Vue SFC Template": {
    "prefix": "sfc",
    "body": [
      "<script setup lang=\"${1:ts}\">",
      "  $5",
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
    "body": ["const emit = defineEmit<{", "  $1: [$2: $3]", "}>()"],
    "description": "初始化 vue3 emits 定义"
  }
}
```
