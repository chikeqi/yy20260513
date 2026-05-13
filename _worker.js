// _worker.js - 完整版音乐网站
const ADMIN_PASSWORD = "music2025";

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#8b5cf6"/><text x="50" y="67" text-anchor="middle" fill="white" font-size="50" font-family="Arial">🎵</text></svg>`;

// 修改密码页面
const ADMIN_PAGE = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><title>修改密码</title><style>
body{background:#0a0c15;font-family:system-ui;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;padding:20px;}
.card{background:#11131f;border-radius:24px;padding:30px;width:100%;max-width:380px;border:1px solid #334155;}
h2{color:#eef2ff;margin-bottom:20px;}
input{width:100%;padding:12px;margin:10px 0;border-radius:40px;background:#1e293b;border:none;color:white;}
button{background:#3b82f6;border:none;padding:12px;border-radius:40px;color:white;cursor:pointer;width:100%;}
.back{background:#334155;margin-top:10px;text-align:center;display:block;text-decoration:none;padding:12px;border-radius:40px;color:white;}
.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1e293b;color:#bef264;padding:8px 20px;border-radius:40px;display:none;}
</style>
</head>
<body>
<div class="card"><h2>🔐 修改密码</h2>
<input type="password" id="oldPwd" placeholder="当前密码">
<input type="password" id="newPwd" placeholder="新密码">
<input type="password" id="confirmPwd" placeholder="确认新密码">
<button id="saveBtn">保存</button>
<a href="/" class="back back-btn">← 返回首页</a>
</div>
<div id="toast" class="toast"></div>
<script>
async function save(){const old=document.getElementById('oldPwd').value,newp=document.getElementById('newPwd').value,confirm=document.getElementById('confirmPwd').value;
if(!old||!newp){showToast('请填写完整');return;}
if(newp!==confirm){showToast('两次新密码不一致');return;}
const res=await fetch('/api/admin/password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({old,new:newp})});
const data=await res.json();
if(data.success){showToast('修改成功，请牢记新密码');setTimeout(()=>{location.href='/';},1500);}
else showToast(data.error||'修改失败');}
function showToast(msg){const t=document.getElementById('toast');t.innerText=msg;t.style.display='block';setTimeout(()=>t.style.display='none',2000);}
document.getElementById('saveBtn').onclick=save;
</script>
</body>
</html>`;

// 更换 Logo 页面
const PICTURE_PAGE = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><title>更换Logo</title><style>
body{background:#0a0c15;font-family:system-ui;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;padding:20px;}
.card{background:#11131f;border-radius:24px;padding:30px;width:100%;max-width:380px;border:1px solid #334155;}
h2{color:#eef2ff;margin-bottom:20px;}
input{width:100%;padding:12px;margin:10px 0;border-radius:40px;background:#1e293b;border:none;color:white;}
button{background:#3b82f6;border:none;padding:12px;border-radius:40px;color:white;cursor:pointer;width:100%;margin-top:10px;}
.back{background:#334155;margin-top:10px;text-align:center;display:block;text-decoration:none;padding:12px;border-radius:40px;color:white;}
.preview{text-align:center;margin:15px 0;padding:10px;background:#0a0c15;border-radius:16px;}
.preview img{max-width:100px;border-radius:16px;}
.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1e293b;color:#bef264;padding:8px 20px;border-radius:40px;display:none;}
</style>
</head>
<body>
<div class="card"><h2>🖼️ 更换 Logo</h2>
<input type="text" id="logoUrl" placeholder="Logo 图片地址 (外链)">
<input type="text" id="logoLink" placeholder="点击 Logo 跳转链接">
<div class="preview"><span>预览：</span><br><img id="preview" src="https://picsum.photos/id/20/100/100"></div>
<button id="saveBtn">保存</button>
<button id="resetBtn">恢复默认</button>
<a href="/" class="back">← 返回首页</a>
</div>
<div id="toast" class="toast"></div>
<script>
let cfg={imgUrl:'',linkUrl:''};
async function load(){const res=await fetch('/api/logo/get');const data=await res.json();if(data.success){cfg=data.config;document.getElementById('logoUrl').value=cfg.imgUrl||'';document.getElementById('logoLink').value=cfg.linkUrl||'';updatePreview();}}
function updatePreview(){const url=document.getElementById('logoUrl').value;const preview=document.getElementById('preview');if(url)preview.src=url;else preview.src='https://picsum.photos/id/20/100/100';}
async function save(){const img=document.getElementById('logoUrl').value;const link=document.getElementById('logoLink').value;const res=await fetch('/api/logo/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({imgUrl:img,linkUrl:link})});const data=await res.json();if(data.success){showToast('保存成功');}else showToast(data.error||'保存失败');}
async function reset(){const res=await fetch('/api/logo/reset',{method:'POST'});const data=await res.json();if(data.success){document.getElementById('logoUrl').value='';document.getElementById('logoLink').value='';updatePreview();showToast('已恢复默认');}else showToast('恢复失败');}
function showToast(msg){const t=document.getElementById('toast');t.innerText=msg;t.style.display='block';setTimeout(()=>t.style.display='none',2000);}
document.getElementById('logoUrl').oninput=updatePreview;document.getElementById('saveBtn').onclick=save;document.getElementById('resetBtn').onclick=reset;load();
</script>
</body>
</html>`;

// 首页 HTML（美化版）
const HTML_CONTENT = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>云音盒 · 音乐收藏家</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.ico">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: linear-gradient(135deg, #0a0c15 0%, #1a1d2e 100%);
            font-family: system-ui, -apple-system, sans-serif;
            color: #eef2ff;
            min-height: 100vh;
            padding: 20px;
        }
        /* 顶部标题居中 */
        .header {
            text-align: center;
            margin-bottom: 25px;
        }
        .header h1 {
            font-size: 1.8rem;
            background: linear-gradient(135deg, #c084fc, #60a5fa);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            letter-spacing: 2px;
        }
        .header p {
            font-size: 0.7rem;
            color: #6b7280;
            margin-top: 5px;
        }
        /* Logo 区域 - 左上角 */
        .logo-area {
            position: fixed;
            top: 15px;
            left: 15px;
            cursor: pointer;
            z-index: 100;
        }
        .logo-img {
            width: 60px;
            height: 60px;
            border-radius: 16px;
            object-fit: cover;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: transform 0.2s;
        }
        .logo-img:hover { transform: scale(1.02); }
        /* 上传和播放器 - 横向排放 */
        .top-row {
            display: flex;
            gap: 15px;
            margin-bottom: 25px;
            flex-wrap: wrap;
        }
        .upload-card {
            flex: 1;
            min-width: 180px;
            background: rgba(18, 20, 32, 0.6);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 12px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            border: 1px solid rgba(255,255,255,0.05);
        }
        .upload-btn {
            background: linear-gradient(135deg, #8b5cf6, #3b82f6);
            border: none;
            padding: 8px 20px;
            border-radius: 40px;
            font-weight: 500;
            color: white;
            cursor: pointer;
            font-size: 0.85rem;
            white-space: nowrap;
        }
        .upload-note {
            font-size: 0.65rem;
            color: #6b7280;
        }
        #fileInput { display: none; }
        /* 播放器卡片 */
        .player-card {
            flex: 2;
            min-width: 260px;
            background: rgba(18, 20, 32, 0.6);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 10px 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            border: 1px solid rgba(255,255,255,0.05);
        }
        .cover-art {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            object-fit: cover;
        }
        .track-info {
            flex: 1;
            min-width: 100px;
        }
        .track-title { font-size: 0.85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .track-artist { font-size: 0.65rem; color: #a78bfa; }
        .progress-area { flex: 2; min-width: 120px; }
        .progress-bg {
            background: #2d2a3e;
            height: 4px;
            border-radius: 10px;
            cursor: pointer;
        }
        .progress-fill {
            background: linear-gradient(90deg, #c084fc, #60a5fa);
            width: 0%;
            height: 4px;
            border-radius: 10px;
        }
        .time-row { display: flex; justify-content: space-between; font-size: 0.6rem; margin-top: 4px; color: #9ca3af; }
        .controls { display: flex; gap: 6px; }
        .ctrl-btn {
            background: #1e1b2e;
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            font-size: 0.85rem;
            color: white;
            cursor: pointer;
            transition: 0.1s;
        }
        .ctrl-btn:active { transform: scale(0.95); }
        .play-btn { background: #8b5cf6; width: 38px; height: 38px; font-size: 1rem; }
        /* 模式栏 */
        .mode-bar {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-bottom: 20px;
        }
        .mode-btn {
            background: #1e293b;
            border: none;
            padding: 5px 20px;
            border-radius: 30px;
            color: #cbd5e1;
            cursor: pointer;
            font-size: 0.75rem;
            transition: 0.2s;
        }
        .mode-btn.active {
            background: #3b82f6;
            color: white;
            box-shadow: 0 0 8px #3b82f6;
        }
        /* 音乐列表 - 横向滚动 3 列 */
        .music-section {
            margin-top: 10px;
        }
        .music-section h3 {
            font-size: 0.9rem;
            margin-bottom: 12px;
            color: #cbd5e1;
        }
        .music-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
        }
        .music-item {
            background: #11131f;
            border-radius: 16px;
            padding: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            border: 1px solid #1f2937;
            transition: 0.2s;
        }
        .music-item:hover {
            background: #1a1d2e;
            transform: translateY(-2px);
        }
        .music-cover {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            object-fit: cover;
        }
        .music-name {
            flex: 1;
            font-size: 0.75rem;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .music-actions {
            display: flex;
            gap: 8px;
        }
        .icon-btn {
            background: none;
            border: none;
            font-size: 0.85rem;
            cursor: pointer;
            color: #cbd5e1;
            padding: 4px;
        }
        .delete-btn { color: #f87171; }
        /* 响应式：小于800px时改为2列 */
        @media (max-width: 800px) {
            .music-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 550px) {
            .music-grid { grid-template-columns: 1fr; }
            .top-row { flex-direction: column; }
            .logo-area { position: static; text-align: center; margin-bottom: 15px; }
            .header h1 { font-size: 1.4rem; }
        }
        /* 弹窗 */
        .modal {
            display: none;
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.8);
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .modal-content {
            background: #0f111f;
            border-radius: 24px;
            padding: 24px;
            width: 90%;
            max-width: 300px;
            text-align: center;
            border: 1px solid #334155;
        }
        .modal-content h3 { margin-bottom: 10px; }
        .modal-content input {
            width: 100%;
            padding: 10px;
            margin: 12px 0;
            border-radius: 30px;
            background: #1e293b;
            border: none;
            color: white;
        }
        .modal-content button {
            background: #3b82f6;
            border: none;
            padding: 8px 20px;
            border-radius: 30px;
            color: white;
            margin: 5px;
            cursor: pointer;
        }
        .toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #1e293b;
            color: #bef264;
            padding: 8px 20px;
            border-radius: 30px;
            font-size: 0.75rem;
            display: none;
            z-index: 1100;
        }
    </style>
</head>
<body>
    <!-- Logo 左上角 -->
    <div class="logo-area" id="logoArea">
        <img id="logoImg" class="logo-img" src="https://picsum.photos/id/20/60/60" alt="logo">
    </div>

    <!-- 顶部标题居中 -->
    <div class="header">
        <h1>🎵 音乐库</h1>
        <p>云端收藏 · 永久保存</p>
    </div>

    <!-- 上传和播放器横向排列 -->
    <div class="top-row">
        <div class="upload-card">
            <button class="upload-btn" id="uploadBtn">📤 上传音乐</button>
            <span class="upload-note">MP3 | 需密码</span>
            <input type="file" id="fileInput" accept="audio/mpeg" multiple>
        </div>

        <div class="player-card">
            <img id="nowCover" class="cover-art" src="https://picsum.photos/id/145/48/48">
            <div class="track-info">
                <div class="track-title" id="nowTitle">未选择歌曲</div>
                <div class="track-artist" id="nowArtist">点击列表播放</div>
            </div>
            <div class="progress-area">
                <div class="progress-bg" id="progressBg"><div class="progress-fill" id="progressFill"></div></div>
                <div class="time-row"><span id="curTime">0:00</span><span id="totalTime">0:00</span></div>
            </div>
            <div class="controls">
                <button class="ctrl-btn" id="prevBtn">⏮</button>
                <button class="ctrl-btn play-btn" id="playPauseBtn">▶</button>
                <button class="ctrl-btn" id="nextBtn">⏭</button>
            </div>
        </div>
    </div>

    <!-- 模式切换 -->
    <div class="mode-bar">
        <button class="mode-btn active" data-mode="all">🎶 全部循环</button>
        <button class="mode-btn" data-mode="single">🔂 单曲循环</button>
    </div>

    <!-- 音乐列表 3列 -->
    <div class="music-section">
        <h3>📻 我的音乐库</h3>
        <div class="music-grid" id="musicList"></div>
    </div>

    <!-- 密码弹窗 -->
    <div id="passwordModal" class="modal">
        <div class="modal-content">
            <h3>🔐 需要密码</h3>
            <p style="font-size:0.7rem;" id="modalActionText">请输入操作密码</p>
            <input type="password" id="modalPassword" placeholder="密码">
            <div>
                <button id="modalConfirmBtn">确认</button>
                <button id="modalCancelBtn">取消</button>
            </div>
        </div>
    </div>

    <div id="toastMsg" class="toast"></div>

    <script>
        let playMode = "all";
        let songsList = [];
        let currentIndex = 0;
        let audio = new Audio();
        let isPlaying = false;
        let pendingAction = null;
        let pendingFiles = null;
        let logoConfig = { imgUrl: "", linkUrl: "" };

        function showToast(msg) {
            const toast = document.getElementById("toastMsg");
            toast.innerText = msg;
            toast.style.display = "block";
            setTimeout(() => toast.style.display = "none", 2000);
        }

        function formatTime(sec) {
            if (isNaN(sec)) return "0:00";
            let m = Math.floor(sec / 60);
            let s = Math.floor(sec % 60);
            return m + ":" + (s < 10 ? "0" + s : s);
        }

        function updatePlayButton() {
            document.getElementById("playPauseBtn").innerText = isPlaying ? "⏸" : "▶";
        }

        function playSongByIndex(index) {
            if (!songsList.length) return;
            if (index < 0) index = 0;
            if (index >= songsList.length) index = 0;
            currentIndex = index;
            const song = songsList[currentIndex];
            audio.src = song.url;
            audio.load();
            document.getElementById("nowTitle").innerText = song.name;
            document.getElementById("nowArtist").innerText = song.artist || "云端音乐";
            document.getElementById("nowCover").src = song.cover || "https://picsum.photos/id/145/48/48";
            audio.play().then(() => { isPlaying = true; updatePlayButton(); }).catch(() => { isPlaying = false; updatePlayButton(); });
        }

        function nextTrack() {
            if (!songsList.length) return;
            if (playMode === "single") {
                if (audio.src) audio.currentTime = 0;
                audio.play().catch(()=>{});
                return;
            }
            let next = currentIndex + 1;
            if (next >= songsList.length) next = 0;
            playSongByIndex(next);
        }

        function prevTrack() {
            if (!songsList.length) return;
            let prev = currentIndex - 1;
            if (prev < 0) prev = songsList.length - 1;
            playSongByIndex(prev);
        }

        function togglePlay() {
            if (!songsList.length && !audio.src) { showToast("暂无歌曲"); return; }
            if (!audio.src && songsList.length) playSongByIndex(0);
            else if (isPlaying) { audio.pause(); isPlaying = false; updatePlayButton(); }
            else { audio.play().then(() => { isPlaying = true; updatePlayButton(); }).catch(() => { isPlaying = false; updatePlayButton(); }); }
        }

        async function fetchSongs() {
            const res = await fetch("/api/songs");
            const data = await res.json();
            return data.songs || [];
        }

        async function uploadSong(file) {
            const fd = new FormData();
            fd.append("song", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            return res.json();
        }

        async function deleteSongReq(id, pwd) {
            const res = await fetch("/api/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, password: pwd })
            });
            return res.json();
        }

        async function renderMusicList() {
            const container = document.getElementById("musicList");
            if (!container) return;
            if (!songsList.length) {
                container.innerHTML = "<div style='grid-column:1/-1; text-align:center; color:#6b7280; padding:30px;'>🎧 暂无音乐，点击上传</div>";
                return;
            }
            container.innerHTML = "";
            for (let i = 0; i < songsList.length; i++) {
                const song = songsList[i];
                const div = document.createElement("div");
                div.className = "music-item";
                div.innerHTML = \`
                    <img class="music-cover" src="\${song.cover || 'https://picsum.photos/id/26/40/40'}" onerror="this.src='https://picsum.photos/id/26/40/40'">
                    <div class="music-name">\${escapeHtml(song.name)}</div>
                    <div class="music-actions">
                        <button class="icon-btn play-song" data-id="\${song.id}">▶</button>
                        <button class="icon-btn delete-btn delete-song" data-id="\${song.id}">🗑️</button>
                    </div>
                \`;
                container.appendChild(div);
            }
            document.querySelectorAll(".play-song").forEach(btn => {
                btn.onclick = () => {
                    const id = btn.getAttribute("data-id");
                    const idx = songsList.findIndex(s => s.id === id);
                    if (idx !== -1) playSongByIndex(idx);
                };
            });
            document.querySelectorAll(".delete-song").forEach(btn => {
                btn.onclick = () => {
                    pendingAction = { type: "delete", id: btn.getAttribute("data-id") };
                    document.getElementById("modalActionText").innerText = "请输入删除密码";
                    document.getElementById("passwordModal").style.display = "flex";
                    document.getElementById("modalPassword").value = "";
                };
            });
        }

        function escapeHtml(str) {
            return str.replace(/[&<>]/g, function(m) {
                if (m === "&") return "&amp;";
                if (m === "<") return "&lt;";
                if (m === ">") return "&gt;";
                return m;
            });
        }

        async function refreshAll() {
            const raw = await fetchSongs();
            songsList = raw.map(s => ({ ...s, artist: s.artist || "音乐人" }));
            await renderMusicList();
        }

        async function loadLogo() {
            const res = await fetch("/api/logo/get");
            const data = await res.json();
            if (data.success && data.config) {
                logoConfig = data.config;
                const logoImg = document.getElementById("logoImg");
                if (logoConfig.imgUrl && logoConfig.imgUrl.trim()) {
                    logoImg.src = logoConfig.imgUrl;
                } else {
                    logoImg.src = "https://picsum.photos/id/20/60/60";
                }
                const logoArea = document.getElementById("logoArea");
                logoArea.style.cursor = logoConfig.linkUrl ? "pointer" : "default";
                logoArea.onclick = () => { if (logoConfig.linkUrl) window.open(logoConfig.linkUrl, "_blank"); };
            }
        }

        function triggerUpload() {
            pendingAction = "upload";
            document.getElementById("modalActionText").innerText = "请输入上传密码";
            document.getElementById("passwordModal").style.display = "flex";
            document.getElementById("modalPassword").value = "";
        }

        async function doUpload(files) {
            for (let f of files) {
                if (!f.name.toLowerCase().endsWith(".mp3")) { showToast("跳过: " + f.name); continue; }
                showToast("上传中: " + f.name);
                const resp = await uploadSong(f);
                if (resp.success) showToast("✅ " + resp.name);
                else showToast("❌ 失败: " + resp.error);
            }
            await refreshAll();
        }

        function bindEvents() {
            document.getElementById("uploadBtn").onclick = triggerUpload;
            const fileInput = document.getElementById("fileInput");
            fileInput.onchange = (e) => {
                pendingFiles = Array.from(e.target.files);
                triggerUpload();
                fileInput.value = "";
            };
            document.getElementById("playPauseBtn").onclick = togglePlay;
            document.getElementById("nextBtn").onclick = nextTrack;
            document.getElementById("prevBtn").onclick = prevTrack;
            const progressBg = document.getElementById("progressBg");
            audio.ontimeupdate = () => {
                if (audio.duration) {
                    document.getElementById("progressFill").style.width = (audio.currentTime / audio.duration) * 100 + "%";
                    document.getElementById("curTime").innerText = formatTime(audio.currentTime);
                    document.getElementById("totalTime").innerText = formatTime(audio.duration);
                }
            };
            progressBg.onclick = (e) => {
                if (audio.duration) {
                    const rect = progressBg.getBoundingClientRect();
                    const ratio = (e.clientX - rect.left) / rect.width;
                    audio.currentTime = ratio * audio.duration;
                }
            };
            audio.onended = nextTrack;
            document.querySelectorAll(".mode-btn").forEach(btn => {
                btn.onclick = () => {
                    document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                    playMode = btn.dataset.mode;
                    showToast(playMode === "all" ? "全部循环" : "单曲循环");
                };
            });
            const modal = document.getElementById("passwordModal");
            document.getElementById("modalConfirmBtn").onclick = async () => {
                const pwd = document.getElementById("modalPassword").value;
                if (!pwd) { showToast("请输入密码"); return; }
                if (pendingAction === "upload") {
                    if (pendingFiles && pendingFiles.length) {
                        await doUpload(pendingFiles);
                        pendingFiles = null;
                    }
                } else if (pendingAction && pendingAction.type === "delete") {
                    const result = await deleteSongReq(pendingAction.id, pwd);
                    if (result.success) { showToast("删除成功"); await refreshAll(); }
                    else showToast("删除失败: " + (result.error || "密码错误"));
                }
                modal.style.display = "none";
                pendingAction = null;
            };
            document.getElementById("modalCancelBtn").onclick = () => {
                modal.style.display = "none";
                pendingAction = null;
                pendingFiles = null;
            };
        }

        async function init() {
            await loadLogo();
            bindEvents();
            await refreshAll();
        }
        init();
    </script>
</body>
</html>`;

let currentPassword = ADMIN_PASSWORD;

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        };
        
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }
        
        if (path === "/favicon.ico") {
            return new Response(FAVICON_SVG, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" } });
        }
        
        if (path === "/admin") {
            return new Response(ADMIN_PAGE, { headers: { "Content-Type": "text/html" } });
        }
        
        if (path === "/picture") {
            return new Response(PICTURE_PAGE, { headers: { "Content-Type": "text/html" } });
        }
        
        if (path === "/api/admin/password" && request.method === "POST") {
            try {
                const { old, new: newPwd } = await request.json();
                const storedPwd = await env.music_kv.get("admin_password");
                const validPwd = storedPwd || currentPassword;
                if (old !== validPwd) {
                    return Response.json({ success: false, error: "当前密码错误" }, { headers: corsHeaders });
                }
                await env.music_kv.put("admin_password", newPwd);
                currentPassword = newPwd;
                return Response.json({ success: true }, { headers: corsHeaders });
            } catch (error) {
                return Response.json({ success: false, error: error.message }, { headers: corsHeaders });
            }
        }
        
        if (path === "/api/logo/get" && request.method === "GET") {
            try {
                let config = await env.music_kv.get("logo_config", "json");
                if (!config) config = { imgUrl: "", linkUrl: "" };
                return Response.json({ success: true, config }, { headers: corsHeaders });
            } catch (error) {
                return Response.json({ success: false, error: error.message }, { headers: corsHeaders });
            }
        }
        
        if (path === "/api/logo/save" && request.method === "POST") {
            try {
                const { imgUrl, linkUrl } = await request.json();
                await env.music_kv.put("logo_config", JSON.stringify({ imgUrl, linkUrl }));
                return Response.json({ success: true }, { headers: corsHeaders });
            } catch (error) {
                return Response.json({ success: false, error: error.message }, { headers: corsHeaders });
            }
        }
        
        if (path === "/api/logo/reset" && request.method === "POST") {
            try {
                await env.music_kv.put("logo_config", JSON.stringify({ imgUrl: "", linkUrl: "" }));
                return Response.json({ success: true }, { headers: corsHeaders });
            } catch (error) {
                return Response.json({ success: false, error: error.message }, { headers: corsHeaders });
            }
        }
        
        if (path === "/api/songs" && request.method === "GET") {
            try {
                const list = await env.music_kv.list();
                const songs = [];
                for (const key of list.keys) {
                    if (key.name.startsWith("meta_") || key.name === "admin_password" || key.name === "logo_config") continue;
                    const metaKey = "meta_" + key.name;
                    let metadata = await env.music_kv.get(metaKey, "json");
                    if (!metadata) {
                        const namePart = decodeURIComponent(key.name.replace(/^\d+_/, "").replace(/\.mp3$/, ""));
                        metadata = { name: namePart, artist: "未知歌手", cover: "https://picsum.photos/id/" + Math.floor(Math.random() * 100) + "/100/100" };
                    }
                    songs.push({
                        id: key.name,
                        name: metadata.name,
                        artist: metadata.artist,
                        cover: metadata.cover,
                        url: "/api/play/" + encodeURIComponent(key.name)
                    });
                }
                songs.reverse();
                return Response.json({ success: true, songs }, { headers: corsHeaders });
            } catch (error) {
                return Response.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
            }
        }
        
        if (path.startsWith("/api/play/") && request.method === "GET") {
            const songId = decodeURIComponent(path.replace("/api/play/", ""));
            try {
                const audioData = await env.music_kv.get(songId, { type: "arrayBuffer" });
                if (!audioData) return new Response("音乐不存在", { status: 404 });
                return new Response(audioData, {
                    headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=86400", ...corsHeaders }
                });
            } catch (error) {
                return new Response("读取失败", { status: 500 });
            }
        }
        
        if (path === "/api/upload" && request.method === "POST") {
            try {
                const formData = await request.formData();
                const songFile = formData.get("song");
                if (!songFile || !songFile.name.toLowerCase().endsWith(".mp3")) {
                    return Response.json({ success: false, error: "请上传 MP3 文件" }, { headers: corsHeaders });
                }
                const timestamp = Date.now();
                const cleanName = songFile.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5.]/g, "_");
                const songId = timestamp + "_" + cleanName;
                const songBuffer = await songFile.arrayBuffer();
                await env.music_kv.put(songId, songBuffer);
                const songName = songFile.name.replace(/\.mp3$/i, "");
                await env.music_kv.put("meta_" + songId, JSON.stringify({
                    name: songName, artist: "上传者",
                    cover: "https://picsum.photos/id/" + Math.floor(Math.random() * 100 + 10) + "/100/100",
                    uploadTime: timestamp
                }));
                return Response.json({ success: true, name: songName, id: songId }, { headers: corsHeaders });
            } catch (error) {
                return Response.json({ success: false, error: error.message }, { headers: corsHeaders });
            }
        }
        
        if (path === "/api/delete" && request.method === "POST") {
            try {
                const { id, password } = await request.json();
                const storedPwd = await env.music_kv.get("admin_password");
                const validPwd = storedPwd || currentPassword;
                if (password !== validPwd) {
                    return Response.json({ success: false, error: "密码错误" }, { headers: corsHeaders });
                }
                await env.music_kv.delete(id);
                await env.music_kv.delete("meta_" + id);
                return Response.json({ success: true }, { headers: corsHeaders });
            } catch (error) {
                return Response.json({ success: false, error: error.message }, { headers: corsHeaders });
            }
        }
        
        if (path === "/" || path === "") {
            return new Response(HTML_CONTENT, { headers: { "Content-Type": "text/html", ...corsHeaders } });
        }
        
        return new Response("Not found", { status: 404 });
    }
};
