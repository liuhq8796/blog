# Linux 更改文件的权限

为了方便更改文件的权限，Linux 使用数字代替`rwx`，具体规则为：用 4(2的2次方) 表示`r`，用 2(2的1次方) 表示`w`，用 1(2的0次方) 表示`x`，用 0 表示`-`。例如，`rwxrwx---`用数字表示就是 770，其具体算法为：`rwx=4+2+1=7`，`rwx=4+2+1=7`，`---=0+0+0=0`。

命令`chmod`（change mode 的简写）用于改变用户对文件或目录的读、写和执行权限，其格式为：`chmod [-R] xyz 文件名`（这里的`xyz`表示数字）。其中，`-R`选项的作用表示级联更改。值得注意的是，在 Linux 系统中，一个目录的默认权限为 755，而一个文件的默认权限为 644。下面我们举例说明一下：

```sh
ls -ld dir3
# drwxr-xr-x 2 user1 testgroup 19 12月 30 07:46 dir3
ls -l dir3
# 总用量 0
# -rw-r--r-- 1 user1 testgroup 0 12月 30 07:46 test3
chmod 750 dir3
ls -ld dir3
# drwxr-x--- 2 user1 testgroup 19 12月 30 07:46 dir3
ls -l dir3/test3
# -rw-r--r-- 1 user1 testgroup 0 12月 30 07:46 dir3/test3
chmod 700 dir3/test3
ls -l dir3/test3
# -rwx------ 1 user1 testgroup 0 12月 30 07:46 dir3/test3
chmod -R 700 dir3
ls -ld dir3
# drwx------ 2 user1 testgroup 19 12月 30 07:46 dir3
ls -l dir3
# 总用量 0
# -rwx------ 1 user1 testgroup 0 12月 30 07:46 test3
```

如果你创建了一个目录，但又不想让其他人看到该目录的内容，则只需将其权限设置成`rwxr-----`（即 740）即可。

`chmod`命令还支持使用`rwx`的方式来设置权限。从之前的介绍中可以发现，基本上就 9 个属性。我们可以使用`u`、`g`和`o`来分别表示`所有者`、`所属组`和`其他用户`的属性，用`a`代表`all`（即全部）。下面举例介绍它们的用法，示例命令如下：

```sh
chmod u=rwx,go=rx dir3/test3
ls -l dir3/test3
# -rwxr-xr-x 1 user1 testgroup 0 12月 30 07:46 dir3/test3
```

这样可以把 dir3/test3 的文件权限修改为`rwxr-xr-x`。此外，我们还可以针对`u`、`g`、`o`和`a`，增加或者减少它们的某个权限（读、写或执行），示例命令如下：

```sh
chmod u-x dir3/test3
ls -l dir3
# 总用量 0
# -rw-r-xr-x 1 user1 testgroup 0 12月 30 07:46 test3
chmod a-x dir3/test3
ls -l dir3/test3
# -rw-r--r-- 1 user1 testgroup 0 12月 30 07:46 dir3/test3
chmod u+x dir3/test3
ls -l dir3/test3
# -rwxr--r-- 1 user1 testgroup 0 12月 30 07:46 dir3/test3
```