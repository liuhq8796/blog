#!/usr/bin/env node

// 路径模块
const path = require("path");
// 交互模块
const prompts = require("prompts");
// 保存文件
const fileSave = require("file-save");

const questions = [
  {
    type: "select",
    name: "type",
    message: "选择一个类型",
    choices: [
      { title: "无", value: 0 },
      { title: "源码共读", value: 1 },
      { title: "最佳实践", value: 2 },
      { title: "TS 类型体操", value: 3 },
    ],
    initial: 0,
  },
  {
    type: "text",
    name: "title",
    message: "请输入笔记标题",
  },
  {
    type: (prev, values, prompt) => {
      if (values.type === 1) {
        return "number";
      }
      return null;
    },
    name: "order",
    message: "请输入【源码共读】期数",
  },
  {
    type: (prev, values, prompt) => {
      if (values.type === 1 || values.type === 3) {
        return "text";
      }
      return null;
    },
    name: "url",
    message: (prev, values, prompt) => {
      if (values.type === 1) {
        return "请输入源码共读链接"
      } else if (values.type === 3) {
        return "请输入挑战链接"
      } else {
        return ""
      }
    },
  },
];

async function init() {
  let result = {};

  try {
    result = await prompts(questions);

    let prefix = "";
    switch (result.type) {
      case 0:
        prefix = "";
        break;
      case 1:
        prefix = "【源码共读】";
        break;
      case 2:
        prefix = "【最佳实践】";
        break;
      case 3:
        prefix = "【TS 类型体操】";
        break;
      default:
        prefix = "";
        break;
    }

    // 文件名
    const fileName =
      (prefix + result.title)
        .replace(/[<>:"\/\\|?*]+/g, "")
        .trim()
        .replace(/\s+/, " ") + ".md";

    // 笔记路径
    const notePath = path.join(__dirname, "../notes");

    let file = {};

    switch (result.type) {
      case 1:
        file = {
          fileName: fileName,
          content: `# ${prefix}${result.title}

## 前言

> 本文参加了由 [公众号@若川视野](https://lxchuan12.gitee.io/) 发起的每周源码共读活动，点击[了解详情](https://juejin.cn/post/7079706017579139102)一起参与。

> 这是源码共读的第 ${result.order} 期，链接：${result.url}。`,
        };
        break;
      case 3:
        file = {
          fileName: fileName,
          content: `# ${prefix}${result.title}

## 前言

本系列用来记录我在 [type-challenges](https://github.com/type-challenges/type-challenges) 项目中的挑战笔记。

题目链接：${result.url}

## 题目`
        }
        break;
      case 0:
      case 2:
      default:
        file = {
          fileName: fileName,
          content: `# ${prefix}${result.title}`,
        };
        break;
    }

    // 添加到 articles.json 文件中
    const articles = require("../articles.json");
    const key = prefix + result.title;
    if (articles[key]) {
      console.error("文件名已存在 - File name already exists");
      process.exit(1);
    }
    articles[key] = result;
    fileSave(path.join(__dirname, "../articles.json"))
      .write(JSON.stringify(articles, null, 2), "utf8")
      .end("\n");

    fileSave(path.join(notePath, file.fileName))
      .write(file.content, "utf8")
      .end("\n");

    console.log("DONE!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

init().catch((e) => {
  console.error(e);
});
