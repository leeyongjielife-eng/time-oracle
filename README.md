# 时间预言签 · 网页版

当前网页版本：`v1.0.1`。

打开 web/index.html 即可使用；推荐在项目根目录运行 `python3 -m http.server 4173 --directory web`，访问 http://localhost:4173。

抽签自动保存到当前浏览器；可标记已实现或销毁。相同问题需两次确认，重复签使用真实秒数并标注参考签。只做去空白、大小写及中英文标点归一，不识别语义近似问题。

仅供娱乐，无预测能力。数据不上传，不支持跨设备同步，清理浏览器可能丢失记录。原小红书存储未迁移到网页；原 ZIP 保持不变。

环境音为 Mixkit 的《Rest Now》，作者 Eugenio Mininni，按 [Mixkit Stock Music Free License](https://mixkit.co/license/#musicFree) 随网页使用。音乐默认关闭，必须由用户主动开启。

创作者联系方式：小红书“疯狂拌年糕”、Threads `@wingkit26go`、X `@wingwhoever`、Gmail `leeyongjielife@gmail.com`。

开发约定见 AGENTS.md。测试：`npm ci`、`npx playwright install chromium`、启动上述服务器后运行 `node tests/web.test.cjs`。
