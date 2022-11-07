# 【最佳实践】去除 Element UI 中 el-upload 组件文件列表上 "按 delete 键可删除"提示

可以重置一下样式：

```css
.el-upload-list__item.is-success:focus:not(:hover) .el-upload-list__item-status-label {
  display: block;
}
.el-upload-list__item.is-success:focus:not(:hover) .el-icon-close-tip {
  display: none;
}
```
