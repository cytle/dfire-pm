---
layout: docs
title: PM2 API
description: Interact or Embed PM2 in your application
permalink: /docs/usage/pm2-api/
---

<!-- PM2 can be used programmatically, meaning that you can embed a process manager directly in your code, spawn processes, keep them alive even if the main script is exited. -->
PM2可以以编程方式使用,这意味着您可以直接在进程代码中嵌入进程管理器,生成进程,即使退出主脚本也可以保持活动状态.

<!-- It's also useful when you deploy a Node.js application [in any kind of Cloud Provider/PaaS](/docs/usage/use-pm2-with-cloud-providers/). -->
在部署Node.js应用程序时也很有用 [在任何一种云提供商/PaaS](/docs/usage/use-pm2-with-cloud-providers/).

## Simple example

<!-- This example shows you how to start app.js with some configuration attributes. Elements passed to start are the same than those you can declare in a [JS/JSON configuration](/docs/usage/application-declaration/) file: -->
此示例显示如何使用某些配置属性启动app.js. 传递给开始的元素与您可以在[JS/JSON](/docs/usage/application-declaration/)配置文件中声明的元素相同

<!-- **NB**: If your script does not exit by itself, make sure you called `pm2.disconnect()` at the end. -->
**NB**: 如果您的脚本本身不退出,请确保在最后调用`pm2.disconnect()`.

```bash
$ npm install pm2 --save
```

```javascript
var pm2 = require('pm2');

pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  pm2.start({
    script    : 'app.js',         // 要运行的脚本 Script to be run
    exec_mode : 'cluster',        // 允许您的应用程序集群 Allows your app to be clustered
    instances : 4,                // 可选:将您的应用程序缩放4 Optional: Scales your app by 4
    max_memory_restart : '100M'   // 可选:如果应用程序达到100Mo,请重新启动 Optional: Restarts your app if it reaches 100Mo
  }, function(err, apps) {
    pm2.disconnect();   // 断开与PM2的连接 Disconnects from PM2
    if (err) throw err
  });
});
```

## 程式化API

`npm install pm2 --save`

<!-- **`pm2.connect(errback)`** - Either connects to a running pm2 daemon ("God") or launches and daemonizes one. Once launched, the pm2 process will keep running after the script exits. -->
**`pm2.connect(errback)`** - 要么连接到一个正在运行的pm2守护进程("God"),要么启动并守护进程. 一旦启动,pm2进程将在脚本退出后继续运行.

**`pm2.connect(noDaemonMode, errback)`**

<!-- * `noDaemonMode` - (Default: false) If true is passed for the first argument, pm2 will not be run as a daemon and will die when the related script exits. By default, pm2 stays alive after your script exits. If pm2 is already running, your script will link to the existing daemon but will die once your process exits. -->
* `noDaemonMode` - (Default: false) 如果第一个参数被传递为true,则pm2将不会作为守护程序运行,并在相关脚本退出时死机. 默认情况下,pm2在您的脚本退出后保持活动. 如果pm2已经运行,您的脚本将链接到现有的守护进程,但是一旦你的进程退出就会死机.

<!-- * `errback(error)` - Called when finished connecting to or launching the pm2 daemon process. -->
* `errback(error)` - 完成连接或启动pm2守护程序进程后调用.

<!-- **`pm2.start(options, errback)`** - Starts a script that will be managed by pm2.   -->
**`pm2.start(options, errback)`** - 启动一个由pm2管理的脚本.
**`pm2.start(jsonConfigFile, errback)`**  
**`pm2.start(script, errback)`**  
**`pm2.start(script, options, errback)`**  
**`pm2.start(script, jsonConfigFile, errback)`**  

<!-- * `script` - The path of the script to run. -->
* `script` - 运行脚本的路径.
<!-- * `jsonConfigFile` - The path to a JSON file that can contain the same options as the `options` parameter. -->
* `jsonConfigFile` - 可以包含与`options`参数相同选项的JSON文件的路径.
<!-- * `errback(err,proc)` - An errback called when the `script` has been started. The `proc` parameter will be a [pm2 process object](https://github.com/soyuka/pm2-notify#templating). -->
* `errback(err,proc)` - 当`script`启动时调用errback. `proc`参数将是一个[pm2进程对象](https://github.com/soyuka/pm2-notify#templating).

<!-- * `options` - An object with the following options (additional descriptions of these options are [here](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#graceful-reload)):
  * `name` - An arbitrary name that can be used to interact with (e.g. restart) the process later in other commands. Defaults to the script name without its extension (eg "testScript" for "testScript.js").
  * `script` - The path of the script to run.
  * `args` - A string or array of strings composed of arguments to pass to the script.
  * `interpreterArgs` - A string or array of strings composed of arguments to call the interpreter process with. Eg "--harmony" or ["--harmony","--debug"]. Only applies if `interpreter` is something other than "none" (its "node" by default).
  * `cwd` - The working directory to start the process with.
  * `output` - (Default: "~/.pm2/logs/app_name-out.log") The path to a file to append stdout output to. Can be the same file as `error`.
  * `error` - (Default: "~/.pm2/logs/app_name-error.err") The path to a file to append stderr output to. Can be the same file as `output`.
  * `logDateFormat` - The display format for log timestamps (eg "YYYY-MM-DD HH:mm Z"). The format is a [moment display format](http://momentjs.com/docs/#/displaying/).
  * `pid` - (Default: "~/.pm2/logs/~/.pm2/pids/app_name-id.pid") The path to a file to write the pid of the started process. The file will be overwritten. Note that the file is not used in any way by pm2 and so the user is free to manipulate or remove that file at any time. The file will be deleted when the process is stopped or the daemon killed.
  * `minUptime` - The minimum uptime of the script before it's considered successfully started.
  * `maxRestarts` - The maximum number of times in a row a script will be restarted if it exits in less than `min_uptime`.
  * `maxMemoryRestart` - If sets and `script`'s memory usage goes about the configured number, pm2 restarts the `script`. Uses human-friendly suffixes: 'K' for kilobytes, 'M' for megabytes, 'G' for gigabytes', etc. Eg "150M".
  * `killTimeout` - (Default: 1600) The number of milliseconds to wait after a `stop` or `restart` command issues a `SIGINT` signal to kill the script forceably with a `SIGKILL` signal.
  * `restartDelay` - (Default: 0) Number of millseconds to wait before restarting a script that has exited.  
  * `interpreter` - (Default: "node") The interpreter for your script (eg "python", "ruby", "bash", etc). The value "none" will execute the 'script' as a binary executable.
  * `execMode` - (Default: 'fork') If sets to 'cluster', will enable clustering (running multiple instances of the `script`). [See here for more details](http://pm2.keymetrics.io/docs/usage/cluster-mode/).
  * `instances` - (*Default: 1*) How many instances of `script` to create. Only relevant in `exec_mode` 'cluster'.
  * `mergeLogs` - (Default: false) If true, merges the log files for all instances of `script` into one stderr log and one stdout log. Only applies in 'cluster' mode. For example, if you have 4 instances of 'test.js' started via pm2, normally you would have 4 stdout log files and 4 stderr log files, but with this option set to true you would only have one stdout file and one stderr file.
  * `watch` - If set to `true`, the application will be restarted on change of the `script` file.
  * `force` (Default: false) By default, pm2 will only start a script if that script isn't already running (a script is a path to an application, not the name of an application already running). If `force` is set to true, pm2 will start a new instance of that script.
  * `cron`
  * `executeCommand`
  * `write`
  * `sourceMapSupport`
  * `disableSourceMapSupport` -->
* `options` - 具有以下选项的对象(这些选项的其他说明是[here](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#graceful-reload)) :
  * `name` - 可以用于与其他命令稍后进行交互的任意名称(例如重新启动)进程.默认为没有扩展名的脚本名称(例如"testScript.js"的"testScript").
  * `script` - 运行脚本的路径.
  * `args` - 由传递给脚本的参数组成的字符串或数组.
  * `interpreterArgs` - 一个由参数组成的字符串或数组,用于调用解释器进程.例如" - 和谐"或[" - 和谐"," - 调试"].只有"解释器"不是"无"(默认为"节点")才适用.
  * `cwd` - 启动进程的工作目录.
  * `output` - (默认值:"~/.pm2/logs/app_name-out.log")将stdout输出附加到的文件的路径.可以是与`error`相同的文件.
  * `error` - (默认值:"~/.pm2/logs/app_name-error.err")将stderr输出附加到的文件的路径.可以是与`output`相同的文件.
  * `logDateFormat` - 日志时间戳的显示格式(例如"YYYY-MM-DD HH:mm Z").格式是[时刻显示格式](http://momentjs.com/docs/#/displaying/).
  * `pid` - (默认值:"~/.pm2/logs/~/.pm2/pids/app_name-id.pid")写入启动进程的pid的文件的路径.该文件将被覆盖.请注意,该文件不会以任何方式由pm2使用,因此用户可以随时操作或删除该文件.当进程停止或守护程序死机时,该文件将被删除.
  * `minUptime` - 脚本在成功启动之前的最短正常运行时间.
  * `maxRestarts` - 如果脚本在小于`min_uptime`的时间内退出,则重新启动脚本的最大次数.
  * `maxMemoryRestart` - 如果set和`script`的内存使用量是关于配置的数字,pm2会重新启动`script`.使用人为友好的后缀:"K"为千字节,"M"为兆字节,"G"为千兆字节等.例如"150M".
  * `killTimeout` - (默认值:1600)在"stop"或"restart"命令之后等待的毫秒数发出"SIGINT"信号,用"SIGKILL"信号强制地杀死脚本.
  * `restartDelay` - (默认值:0)重新启动已退出的脚本之前要等待的毫秒数.
  * `interpreter` - (默认值:"node")脚本的解释器(例如"python","ruby","bash"等).值"none"将执行"脚本"作为二进制可执行文件.
  * `execMode` - (默认值:'fork')如果设置为'cluster',将启用聚类(运行`script`的多个实例). [见这里了解更多细节](http://pm2.keymetrics.io/docs/usage/cluster-mode/).
  * `instances` - (*默认值:1*)要创建多少个`script`实例.只与`exec_mode`'集群'相关.
  * `mergeLogs` - (默认值:false)如果为true,将"script"的所有实例的日志文件合并到一个stderr日志和一个stdout日志中.仅适用于"群集"模式.例如,如果您有4个通过pm2启动的"test.js"实例,通常您将拥有4个stdout日志文件和4个stderr日志文件,但是将此选项设置为true,则只能有一个stdout文件和一个stderr文件.
  * `watch` - 如果设置为"true",则应用程序将在"script"文件更改时重新启动.
  * `force`(默认值:false)默认情况下,如果该脚本尚未运行,那么pm2将仅启动脚本(脚本是应用程序的路径,而不是应用程序的名称已在运行).如果"force"设置为true,则pm2将启动该脚本的新实例.
  * `cron`
  * `executeCommand`
  * `write`
  * `sourceMapSupport`
  * `disableSourceMapSupport`

<!-- **`pm2.disconnect()`** - Disconnects from the pm2 daemon. -->
**`pm2.disconnect()`** - 断开与pm2守护程序的连接.

<!-- **`pm2.stop(process, errback)`** - Stops a process but leaves the process meta-data in pm2's list. *[See here for how pm2 stops a process](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/)*  
**`pm2.restart(process, errback)`** - Stops and restarts the process.  
**`pm2.delete(process, errback)`** - Stops the process and removes it from pm2's list. The process will no longer be accessible by its `name`.
**`pm2.reload(process, errback)`** - Zero-downtime rolling restart. At least one process will be kept running at all times as each instance is restarted individually. *Only works for scripts started in cluster mode. [See here for more details](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#reload-without-downtime).*  
**`pm2.gracefulReload(process, errback)`** - Sends the process a shutdown message before initiating `reload`. [See here for more details](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#graceful-reload). -->

**`pm2.stop(process,errback)`** - 停止进程,但将进程元数据留在pm2的列表中. * [看这里pm2如何停止进程](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/)*
**`pm2.restart(process,errback)`** - 停止并重新启动进程.
**`pm2.delete(process,errback)`** - 停止进程并将其从pm2的列表中删除. 该进程将不再能被其'name'访问.
**`pm2.reload(process,errback)`** - 零停机滚动重启. 随着每个实例被单独重新启动,至少有一个进程将始终保持运行. *仅适用于以群集模式启动的脚本. [见这里了解更多详情](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#reload-without-downtime)*
**`pm2.gracefulReload(process,errback)`** - 在启动`reload`之前发送进程一个关闭消息. [参见这里了解更多细节](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#graceful-reload).

<!-- * `process` - Can either be the `name` as given in the `pm2.start` `options`, a process id, or the string "all" to indicate that all scripts should be restarted. -->
* `process` - 可以是`pm2.start`选项中的`name`,一个进程id,或者是'all'的字符串,表示应该重新启动所有的脚本.
* `errback(err, proc)`

<!-- **`pm2.killDaemon(errback)`** - Kills the pm2 daemon (same as `pm2 kill`). Note that when the daemon is killed, all its processes are also killed. Also note that you still have to explicitly disconnect from the daemon even after you kill it. -->
**`pm2.killDaemon(errback)`** - 杀死pm2守护进程(与"pm2 kill"一样). 请注意,当守护程序被杀死时,其进程也被杀死. 还要注意,即使杀死后,您仍然必须显式断开与守护程序的连接.

<!-- **`pm2.describe(process,errback)`** - Returns various information about a process: eg what stdout/stderr and pid files are used. -->
**`pm2.describe(process,errback)`** - 返回有关进程的各种信息:例如使用什么stdout/stderr和pid文件.

* `errback(err, processDescription)`
<!-- * `processDescription` - An object with information about the process. Contains the properties:
  * `name` - The name given in the original `start` command.
  * `pid` - The pid of the process.
  * `pm_id` - The pid for the `pm2` God daemon process.
  * `monit` - An object containing:
    * `memory` - The number of bytes the process is using.
    * `cpu` - The percent of CPU being used by the process at the moment.
  * `pm2_env` - The list of path variables in the process's environment. These variables include:
    * `pm_cwd` - The working directory of the process.
    * `pm_out_log_path` - The stdout log file path.
    * `pm_err_log_path` - The stderr log file path.
    * `exec_interpreter` - The interpreter used.
    * `pm_uptime` - The uptime of the process.
    * `unstable_restarts` - The number of unstable restarts the process has been through.
    * `restart_time`
    * `status` - "online", "stopping", "stopped", "launching", "errored", or "one-launch-status"
    * `instances` - The number of running instances.
    * `pm_exec_path` - The path of the script being run in this process. -->
* `processDescription` - 具有进程信息的对象.包含属性:
  * `name` - 原始`start`命令中给出的名称.
  * `pid` - 进程的pid.
  * `pm_id` - `pm2`神守护进程的pid.
  * `monit` - 包含以下内容的对象:
    * `memory` - 进程正在使用的字节数.
    * `cpu` - 目前正在使用CPU的百分比.
  * `pm2_env` - 进程环境中的路径变量列表.这些变量包括:
    * `pm_cwd` - 进程的工作目录.
    * `pm_out_log_path` - stdout日志文件路径.
    * `pm_err_log_path` - stderr日志文件路径.
    * `exec_interpreter` - 使用的解释器.
    * `pm_uptime` - 进程的正常运行时间.
    * `unstable_restarts` - 进程已经通过的不稳定重新启动的次数.
    * `restart_time`
    * `status` - "online", "stopping", "stopped", "launching", "errored", or "one-launch-status"
    * `instances` - 运行实例的数量.
    * `pm_exec_path` - 在此过程中运行脚本的路径.

<!-- **`pm2.list(errback)`** - Gets the list of running processes being managed by pm2. -->
**`pm2.list(errback)`** - 获取由pm2管理的正在运行的进程的列表.

<!-- * `errback(err, processDescriptionList)` - The `processDescriptionList` parameter will contain a list of `processDescription` objects as defined under `pm2.describe`. -->
* `errback(err,processDescriptionList)` - `processDescriptionList`参数将包含`pm2.describe`下定义的`processDescription`对象的列表.

<!-- **`pm2.dump(errback)`** - Writes the process list to a json file at the path in the DUMP_FILE_PATH environment variable ("~/.pm2/dump.pm2" by default). -->
**`pm2.dump(errback)`** - 将进程列表写入DUMP_FILE_PATH环境变量(默认为"~/.pm2/dump.pm2")路径中的json文件.

* `errback(err, result)`

<!-- **`pm2.flush(process,errback)`** - Flushes the logs. -->
**`pm2.flush(process,errback)`** - 刷新日志.

* `errback(err, result)`

**`pm2.dump(errback)`**

* `errback(err, result)`

<!-- **`pm2.reloadLogs(errback)`** - *Rotates* the log files. The new log file will have a higher number in it (the default format being `${process.name}-${out|err}-${number}.log`). -->
**`pm2.reloadLogs(errback)`** - *Rotates* 日志文件.新的日志文件将有更多的数字(默认格式为`${process.name}-${out|err}-${number}.log`).

* `errback(err, result)`

<!-- **`pm2.launchBus(errback)`** - Opens a message bus. -->
**`pm2.launchBus(errback)`** - 打开消息总线.

<!-- * `errback(err, bus)` - The `bus` will be an [Axon Sub Emitter](https://github.com/tj/axon#pubemitter--subemitter) object used to listen to and send events. -->
* `errback(err, bus)` - `bus`将是用于侦听和发送事件的[Axon Sub Emitter](https://github.com/tj/axon#pubemitter--subemitter)对象.

**`pm2.sendSignalToProcessName(signal, process, errback)`**

* `errback(err, result)`

<!-- **`pm2.startup(platform, errback)`** - Registers the script as a process that will start on machine boot. Platform can currently be: "ubuntu", "centos", "redhat", "gentoo", "systemd", "darwin", or "amazon". The current process list will be dumped and saved for resurrection on reboot. -->
**`pm2.startup(platform, errback)`** - 将脚本注册为将在机器启动时启动的进程. 平台目前可以是:"ubuntu","centos","redhat","gentoo","systemd","darwin"或"amazon". 当前进程列表将被重新启动时被转储并保存以备重启.

* `errback(err, result)`

## 发送消息到进程

Available in PM2 0.15.11>

pm2-call.js:

```javascript
pm2.connect(function() {
  pm2.sendDataToProcessId({
    type : 'process:msg',
    data : {
      some : 'data',
      hello : true
    },
    id   : proc1.pm2_env.pm_id
  }, function(err, res) {
  });
});

pm2.launchBus(function(err, bus) {
  pm2_bus.on('process:msg', function(packet) {
    packet.data.success.should.eql(true);
    packet.process.pm_id.should.eql(proc1.pm2_env.pm_id);
    done();
  });
});
```

pm2-app.js:

```javascript
process.on('message', function(packet) {
  process.send({
    type : 'process:msg',
    data : {
     success : true
    }
 });
});
```
