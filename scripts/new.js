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
      if (values.type === 1) {
        return "text";
      }
      return null;
    },
    name: "url",
    message: "请输入源码共读链接",
  },
];

async function init() {
  let result = {};

  try {
    result = await prompts(questions);

    // 文件名
    const fileName =
      result.type === 1
        ? "【源码共读】" + result.title + ".md"
        : result.title + ".md";

    // 笔记路径
    const notePath = path.join(__dirname, "../notes");

    let file = {};

    if (result.type === 1) {
      file = {
        fileName: fileName,
        content: `# 【源码共读】${result.title}

## 前言

> 本文参加了由 [公众号@若川视野](https://lxchuan12.gitee.io/) 发起的每周源码共读活动，点击[了解详情](https://juejin.cn/post/7079706017579139102)一起参与。

> 这是源码共读的第 ${result.order} 期，链接：${result.url}。`,
      };
    }

    // 添加到 articles.json 文件中
    const articles = require("../articles.json");
    const key = result.type === 1
    ? "【源码共读】" + result.title
    : result.title;
    if (articles[key]) {
      console.error("文件名已存在 - File name already exists");
      process.exit(1);
    }
    articles[key] = {
      order: result.order,
      url: result.url,
    };
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
