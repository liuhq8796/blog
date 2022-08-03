# 【最佳实践】vs code 保存时自动格式化

打开 vscode 配置文件 settings.json，增加如下配置：

```json
{
    // 在保存时运行的代码操作类型。
    "editor.codeActionsOnSave": {
        // 控制是否应在文件保存时运行自动修复操作。
        // "source.fixAll.eslint" 也会被同时开启。
        "source.fixAll": true,
        // 控制是否应在文件保存时运行"整理 import 语句"操作。
        // "source.organizeImports": true
    }
}
```
