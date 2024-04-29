# Linux 如何正确关机、重启

使用`who`命令查看当前是否还有其他人在登录，或者使用命令`ps -aux`查看是否还有后台进程在运行。

`shutdown`、`halt`、`poweroff`都为关机的命令，我们可以使用命令`man shutdown`查看其帮助文档。例如，可以运行如下命令关机（//符号后面的内容为注释）：

```sh
shutdown -h 10 // 计算机将在10分钟后关机，且会显示在登录用户的当前屏幕中
shutdown -h now // 立即关机
shutdown -h 20:25 // 系统会在20:25关机
shutdown -h +10 // 10分钟后关机
shutdown -r now // 立即重启
shutdown -r +10 // 10分钟后重启
reboot // 重启，等同于shutdown -r now
halt // 关闭系统，等同于shutdown -h now和poweroff
```

不管是重启系统还是关闭系统，首先要运行`sync`命令，该命令可以把当前内存中的数据写入磁盘中，防止数据丢失。

再来总结一下，关机的命令有`shutdown -h now`、`halt`、`poweroff`和`init 0`，重启系统的命令有`shutdown -r now`、`reboot`和`init 6`。