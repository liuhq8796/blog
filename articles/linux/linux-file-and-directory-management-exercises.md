# 极客时间《跟阿铭学 Linux》—— 《第 4 章 Linux文件和目录管理》课后习题

以下答案使用 Ubuntu 20.04 系统验证

(1) 命令`rmdir -p`用来删除一串目录，比如`rmdir -p /tmp/test/1/2/3`。如果 /tmp/1/2/ 目录下除了 3 目录外还有个 4 目录，4 目录里还有 5 目录，那么是否可以成功删除？用命令`rmdir -p`删除一个不存在的目录时，是否会报错呢？

答：test/1/2/3 被删除，同时会报错无法删除目录 test/1/2，因为 test/1/2 不是空目录；删除不存在的目录时会报错：No such file or directory

(2) 删除一个目录或者文件时，在删除之前会先询问我们是否删除，如果直接回车，是否能删除呢？如果输入的不是 y 也不是 n，会发生什么呢？

答：直接回车不会删除，而是和输入不是y或n的内容一样会退出操作

(3) 如何创建一串目录（如 /home/1/2/3/4）？

答：`mkdir -p /home/1/2/3/4`

(4) 使用mv命令时，如果目标文件不是目录，但该文件存在，会怎么样？

答：`mv filea fileb`，filea 被重命名为fileb并覆盖原fileb

(5) 使用`less`命令查看文件 /etc/passwd，搜索一下共出现了几个 root？按哪个键可以向上 / 向下逐行移动？

答：搜索到了3个root，使用J和K上下移动

(6) 为什么目录必须要有x权限才可以查看目录下面的文件呢？

答：目录的执行权限（x）允许用户进入该目录。如果没有执行权限，用户将无法进入目录，也就无法查看目录中的内容。

(7) 如果设置umask为 001，那么用户默认创建的目录和文件的权限是什么样子的？

答：-rw-rw-rw-（文件权限）
drwxrwxrw-(目录权限)

(8) 用`find`找出 /var/ 目录下最近一天内变更的文件，再用`find`找出 /root/ 目录下一小时内变更的文件。

答：`find /var/ -mtime -1`
`find /root/ -mmin -60`

(9) 用`find`找出 /etc/ 目录下一年内从未变更过的文件。

答：`find /etc/ -mtime +365`

(10) 为什么硬链接不能链接目录？硬链接的文件是否占用空间大小？硬链接文件是否可以跨分区创建？

答：搜索了一下，大意是说可能会形成环，导致Linux粗粒不了；硬链接文件并不会复制数据块，额外占用磁盘空间；不能跨文件系统，因为不同的文件系统有不同的inode table

(11) Linux 系统里，分别用什么符号表示纯文本文件、二进制文件、目录、链接文件、块设备以及字符设备？

答：`-`表示普通文件，又可以分为纯文本文件和二进制文件
`d`表示目录
`l`表示链接文件（link file）
`b`表示块设备
`c`表示串行端口设备文件（又称字符设备文件）

(12) 如何把 dira 目录以及该目录下的所有文件和目录修改为所有者为 user1、所属组为 users？

答：`chown -R user1:users dira`

(13) Linux 系统中默认目录的权限是什么？文档的权限是什么？分别用三个数字表示。我们可以通过修改umask的值更改目录和文档的默认权限值，那么如何通过umask的值得到默认权限值呢？

答：目录默认权限：rwxr-xr-x 755
文件默认权限：rw-r—r— 644
通过将umask 设为000，然后新建文件和目录得到默认权限值

(14) 修改 dirb 目录的权限，使其所有者可读、可写且可执行，所属组可读且可执行，其他用户不可读、不可写也不可执行，使用什么命令呢？

答：`chmod -R 750 dirb` 或者 `chmod -R u=rwx,g=rx,o=- dirb`

(15) 如何使文件只能写且不能删除呢？如何使文件不能被删除、重命名、设定链接、写入且新增数据呢？

答：只能写且不能删除：`chattr +a filea`
不能删除、重命名、设定链接、写入且新增数据：`chattr +i fileb`

(16) Linux 下的一个点“.”和两个点“..”分别表示什么？

答：“.”表示当前目录，“..”表示当前目录的上一级目录

(17) `cd -`表示什么含义？

答：当前工作目录将被切换到环境变量OLDPWD所表示的目录，也就是前一个工作目录。

(18) 用`ls`命令查看目录或者文件时，第 2 列的数值表示什么意思？如果一个目录的第 2 列的值为 3，那么这个 3 是如何得到的呢？

答：第2列代表硬链接数，默认为1，通过 `ln` 命令创建2个硬链接后达到3

(19) 如果系统中没有`locate`命令，我们需要安装哪个软件包？初次使用`locate`命令会报错 can not open `/var/lib/mlocate/mlocate.db`: No such file or directory，我们需要如何做呢？

答：需要安装 mlocate 软件包；首次执行前需要运行 `updatedb` 命令立即生成文件列表库

(20) 当复制一个文件时，如果目标文件存在会询问我们是否覆盖，如何做就不再询问了呢？

答：我在Ubuntu系统上的`cp`命令默认没有询问，添加 `-i` 参数后才有询问；如果你的系统默认有询问，可能是添加了别名 "cp='cp -i'"，删除别名后就不再询问了

(21) 假如一个文件内容一直在增加，如何动态显示这个文件的内容呢？

答：`tail -f [目标文件]`

(22) 更改文件读写执行权限的命令是什么？如何把一个目录下的所有文件（不含目录）的权限改为 644？

答：`chmod` 命令
`find . -type f -exec chmod 644 {} \;`
* `find . -type f`：这部分使用 `find` 命令来查找当前目录下的所有文件。`-type f` 表示只匹配文件，不包括目录。
* `-exec chmod 644 {} \;`：这部分表示对于每个找到的文件，会执行 `chmod 644` 命令来修改其权限。`{}` 会被替换为实际的文件名，`\;` 表示命令结束。


(23) 如何查看当前用户的目录?

答：执行 `cd` 或 `cd ~` 进入当前用户更目录，然后执行 `ls` 查看当前目录

(24) 假如一个目录可以让任何人可写，那么如何能做到该目录下的文件只允许文件的所有者更改？

答：执行 `find . -type f -exec chmod 600 {} \;` 将该目录下所有文件权限设为 `rw-------`，只允许文件所有者读写

(25) 简述软链接和硬链接的区别。

> 摘自知乎——https://zhuanlan.zhihu.com/p/67366919

答：【硬连接】
硬连接指通过索引节点来进行连接。在Linux的文件系统中，保存在磁盘分区中的文件不管是什么类型都给它分配一个编号，称为索引节点号(Inode Index)。在Linux中，多个文件名指向同一索引节点是存在的。一般这种连接就是硬连接。硬连接的作用是允许一个文件拥有多个有效路径名，这样用户就可以建立硬连接到重要文件，以防止“误删”的功能。其原因如上所述，因为对应该目录的索引节点有一个以上的连接。只删除一个连接并不影响索引节点本身和其它的连接，只有当最后一个连接被删除后，文件的数据块及目录的连接才会被释放。也就是说，文件真正删除的条件是与之相关的所有硬连接文件均被删除。
【软连接】
另外一种连接称之为符号连接（Symbolic Link），也叫软连接。软链接文件有类似于Windows的快捷方式。它实际上是一个特殊的文件。在符号连接中，文件实际上是一个文本文件，其中包含的有另一文件的位置信息。

(26) `cat a.txt`会更改 a.txt 的什么时间？`chmod 644 a.txt`会更改 a.txt 的什么时间？`vi` 呢？直接`touch`呢？

答：
`cat a.txt`会更改 atime
`chmod 644 a.txt`会更改 ctime
`vim` 编辑文件后会更改 mtime 和 chime
直接`touch`会全部更改 atime、mtime、ctime