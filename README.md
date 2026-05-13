创建cloudflare Pages 项目

绑定KV 名称：music_kv（必须用这个名字）

初始密码	ww1234

你的仓库根目录/

    └── _worker.js 

部署步骤

第一步：创建 KV 命名空间

登录 Cloudflare Dashboard

左侧菜单 → Workers 和 Pages → KV

第二步：创建 Pages 项目

左侧菜单 → Workers 和 Pages → Pages

点击 创建应用程序 → Pages → 连接到 Git

选择你的 GitHub 仓库

构建设置全部留空（不要填任何命令）

第三步：绑定 KV 命名空间

进入 Pages 项目 → 点击 设置 标签

左侧菜单 → 函数

找到 KV 命名空间绑定 → 点击 添加绑定

变量名：music_kv（必须完全一致）

KV 命名空间：选择你创建的 music_kv

修改密码	https://你的项目名.pages.dev/admin

更换 Logo	https://你的项目名.pages.dev/picture

一切到最后都要重新部署一次

