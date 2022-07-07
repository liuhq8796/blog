"use strict";

console.log();
process.on("exit", () => {
  console.log();
});

const regex = new RegExp('"[^"]+"|[\\S]+', "g");
const args = [];
const input = process.argv.slice(2).join(" ");
input.match(regex).forEach((element) => {
  if (!element) return;
  return args.push(element.replace(/"/g, ""));
});

// 至少传入两个参数，若不够则报错，退出进程
if (!args[1]) {
  console.error(
    "[笔记类型][笔记标题]必填 - Please enter new notebook type and title"
  );
  process.exit(1);
}

// 路径模块
const path = require("path");
// 保存文件
const fileSave = require("file-save");
// 第一个参数 type 1: 源码共读
const type = args[0];
// 第二个参数 笔记标题
const title = args[1];
// 文件名
const fileName = title + ".md";
// 第三个参数 若 type === 1，则为源码共读期数
const order = args[2] || "";
// 第四个参数 若 type === 1，则为源码共读链接
const url = args[3] || "";
// 笔记路径
const notePath = path.join(__dirname, "./notes");

const file = {
  fileName: fileName,
  content: `# ${title}

## 前言

> 本文参加了由 [公众号@若川视野](https://lxchuan12.gitee.io/) 发起的每周源码共读活动，点击[了解详情](https://juejin.cn/post/7079706017579139102)一起参与。
        
> 这是源码共读的第${order}期，链接：${url}。`,
};

// 添加到 articles.json 文件中
const articles = require("./articles.json");
if (articles[title]) {
  console.error("文件名已存在 - File name already exists");
  process.exit(1);
}
articles[title] = {
  order,
  url,
};
fileSave(path.join(__dirname, "articles.json"))
  .write(JSON.stringify(articles, null, 2), "utf8")
  .end("\n");

fileSave(path.join(notePath, file.fileName))
  .write(file.content, "utf8")
  .end("\n");

console.log("DONE!");
