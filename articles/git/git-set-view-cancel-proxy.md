# Git 设置、查看、取消代理

## 前言

经常写完代码干急提不上去，电脑开了代理也提不上去，搜了半天发现 git 需要单独配代理，故记录一下。

## 设置代理

> 前提你得有代理哈，下面的 IP 和端口号换成你的

```sh
# http https
git config --global http.proxy 127.0.0.1:10809
git config --global https.proxy 127.0.0.1:10809

# sock5 代理
# 没用过 不懂
git config --global http.proxy socks5 127.0.0.1:10809
git config --global https.proxy socks5 127.0.0.1:10809
```

## 查看代理

```sh
# --get 有没有都中
git config --global --get http.proxy
git config --global --get https.proxy
```

## 取消代理

```sh
git config --global --unset http.proxy
git config --global --unset https.proxy
```
