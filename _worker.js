// _worker.js - 完整版音乐网站
const ADMIN_PASSWORD = "music2025";

// 简单的 SVG favicon
const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#8b5cf6"/><text x="50" y="67" text-anchor="middle" fill="white" font-size="50" font-family="Arial">🎵</text></svg>`;

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>云音盒 · 音乐收藏家</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.ico">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #0a0c15;
            font-family: system-ui, -apple-system, sans-serif;
            color: #eef2ff;
            padding: 20px;
        }
        /* 顶部导航 */
        .navbar {
            display: flex;
            justify-content: center;
            margin-bottom: 30px;
        }
        .logo-area {
            text-align: center;
            cursor: pointer;
        }
        .logo-img {
            width: 100px;
            height: 100px;
            border-radius: 24px;
            object-fit: cover;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
        }
        .logo-text {
            display: block;
            margin-top: 10px;
            font-size: 1.2rem;
            font-weight: 600;
            background: linear-gradient(135deg, #a855f7, #3b82f6);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        /* 上传区域 */
        .upload-card {
            background: rgba(18, 20, 32, 0.7);
            border-radius: 24px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: center;
            border: 1px solid rgba(255,255,255,0.05);
        }
        .upload-btn {
            background: linear-gradient(135deg, #8b5cf6, #3b82f6);
            border: none;
            padding: 12px 28px;
            border-radius: 40px;
            font-weight: 600;
            color: white;
            cursor: pointer;
            font-size: 1rem;
        }
        #fileInput { display: none; }
        /* 播放器 */
        .player-card {
            background: rgba(18, 20, 32, 0.7);
            border-radius: 24px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: center;
        }
        .cover-art {
            width: 100px;
            height: 100px;
            border-radius: 20px;
            object-fit: cover;
            margin-bottom: 15px;
        }
        .track-title { font-size: 1.4rem; font-weight: 700; margin-bottom: 5px; }
        .track-artist { color: #a78bfa; margin-bottom: 15px; }
        .progress-bg {
            background: #2d2a3e;
            height: 5px;
            border-radius: 10px;
            cursor: pointer;
            max-width: 300px;
            margin: 10px auto;
        }
        .progress-fill {
            background: linear-gradient(90deg, #c084fc, #60a5fa);
            width: 0%;
            height: 5px;
            border-radius: 10px;
        }
        .time-row { display: flex; justify-content: center; gap: 20px; font-size: 0.75rem; margin-top: 5px; }
        .controls { display: flex; gap: 1.5rem; justify-content: center; margin-top: 15px; }
        .ctrl-btn {
            background: #1e1b2e;
            border: none;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            font-size: 1.2rem;
            color: white;
            cursor: pointer;
        }
        .play-btn { background: #8b5cf6; width: 54px; height: 54px; font-size: 1.5rem; }
        /* 模式切换 */
        .mode-bar {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 20px;
        }
        .mode-btn {
            background: #1e293b;
            border: none;
            padding: 8px 24px;
            border-radius: 40px;
            color: #cbd5e1;
            cursor: pointer;
        }
        .mode-btn.active { background: #3b82f6; color: white; }
        /* 音乐列表 - 两列网格 */
        .music-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }
        .music-item {
            background: #11131f;
            border-radius: 16px;
            padding: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            border: 1px solid #1f2937;
        }
        .music-cover {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            object-fit: cover;
        }
        .music-name { flex: 1; font-weight: 500; font-size: 0.85rem; }
        .music-actions { display: flex; gap: 10px; }
        .icon-btn {
            background: none;
            border: none;
            font-size: 1.1rem;
            cursor: pointer;
            color: #cbd5e1;
        }
        .delete-btn { color: #f87171; }
        /* 密码弹窗 */
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
            max-width: 320px;
            text-align: center;
        }
        .modal-content input {
            width: 100%;
            padding: 12px;
            margin: 15px 0;
            border-radius: 40px;
            background: #1e293b;
            border: none;
            color: white;
        }
        .modal-content button {
            background: #3b82f6;
            border: none;
            padding: 8px 20px;
            border-radius: 40px;
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
            border-radius: 40px;
            font-size: 0.8rem;
            display: none;
            z-index: 1100;
        }
        @media (max-width: 500px) {
            .music-grid { grid-template-columns: 1fr; }
            .navbar { flex-direction: column; align-items: center; gap: 10px; }
        }
    </style>
</head>
<body>
    <div class="navbar">
        <div class="logo-area" id="logoArea">
            <img id="logoImg" class="logo-img" src="https://picsum.photos/id/20/100/100" alt="logo">
            <span class="logo-text" id="logoTxt">云音盒</span>
        </div>
    </div>

    <div class="upload-card">
        <button class="upload-btn" id="uploadBtn">📤 上传音乐 (需要密码)</button>
        <input type="file" id="fileInput" accept="audio/mpeg" multiple>
        <div style="font-size:0.7rem; color:#6b7280; margin-top:10px;">MP3格式，上传需密码</div>
    </div>

    <div class="player-card">
        <img id="nowCover" class="cover-art" src="https://picsum.photos/id/145/100/100">
        <div class="track-title" id="nowTitle">未选择歌曲</div>
        <div class="track-artist" id="nowArtist">点击列表播放</div>
        <div class="progress-bg" id="progressBg"><div class="progress-fill" id="progressFill"></div></div>
        <div class="time-row"><span id="curTime">0:00</span><span id="totalTime">0:00</span></div>
        <div class="controls">
            <button class="ctrl-btn" id="prevBtn">⏮</button>
            <button class="ctrl-btn play-btn" id="playPauseBtn">▶</button>
            <button class="ctrl-btn" id="nextBtn">⏭</button>
        </div>
    </div>

    <div class="mode-bar">
        <button class="mode-btn active" data-mode="all">全部循环</button>
        <button class="mode-btn" data-mode="single">单曲循环</button>
    </div>

    <div class="music-grid" id="musicList"></div>

    <!-- 密码弹窗 -->
    <div id="passwordModal" class="modal">
        <div class="modal-content">
            <h3>🔐 需要密码</h3>
            <p style="font-size:0.8rem;" id="modalActionText">请输入操作密码</p>
            <input type="password" id="modalPassword" placeholder="密码">
            <div>
                <button id="modalConfirmBtn">确认</button>
                <button id="modalCancelBtn">取消</button>
            </div>
        </div>
    </div>

    <div id="toastMsg" class="toast"></div>

    <script>
        // 密码
        const ADMIN_PASSWORD = "music2025";
        
        // 状态变量
        let playMode = "all";
        let songsList = [];
        let currentIndex = 0;
        let audio = new Audio();
        let isPlaying = false;
        
        // 待操作的数据
        let pendingAction = null;   // 'upload' 或 { type: 'delete', id }
        let pendingFiles = null;
        
        // Logo 配置
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
            const btn = document.getElementById("playPauseBtn");
            btn.innerText = isPlaying ? "⏸" : "▶";
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
            document.getElementById("nowCover").src = song.cover || "https://picsum.photos/id/145/100/100";
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
        
        // 渲染列表 - 两列布局
        async function renderMusicList() {
            const container = document.getElementById("musicList");
            if (!container) return;
            if (!songsList.length) {
                container.innerHTML = "<div style='grid-column:1/-1; text-align:center; color:#6b7280; padding:40px;'>🎧 暂无音乐，点击上方上传 🎧</div>";
                return;
            }
            container.innerHTML = "";
            for (let i = 0; i < songsList.length; i++) {
                const song = songsList[i];
                const div = document.createElement("div");
                div.className = "music-item";
                div.innerHTML = \`
                    <img class="music-cover" src="\${song.cover || 'https://picsum.photos/id/26/48/48'}" onerror="this.src='https://picsum.photos/id/26/48/48'">
                    <div class="music-name">\${escapeHtml(song.name)}</div>
                    <div class="music-actions">
                        <button class="icon-btn play-song" data-id="\${song.id}">▶</button>
                        <button class="icon-btn delete-btn delete-song" data-id="\${song.id}">🗑️</button>
                    </div>
                \`;
                container.appendChild(div);
            }
            // 绑定播放事件
            document.querySelectorAll(".play-song").forEach(btn => {
                btn.onclick = () => {
                    const id = btn.getAttribute("data-id");
                    const idx = songsList.findIndex(s => s.id === id);
                    if (idx !== -1) playSongByIndex(idx);
                };
            });
            // 绑定删除事件（需要密码）
            document.querySelectorAll(".delete-song").forEach(btn => {
                btn.onclick = () => {
                    const id = btn.getAttribute("data-id");
                    pendingAction = { type: "delete", id: id };
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
        
        // Logo 配置
        function loadLogoPref() {
            const saved = localStorage.getItem("music_logo_config");
            if (saved) {
                try { logoConfig = JSON.parse(saved); } catch(e) {}
            }
            applyLogo();
        }
        function applyLogo() {
            const logoImg = document.getElementById("logoImg");
            const logoTxt = document.getElementById("logoTxt");
            if (logoConfig.imgUrl && logoConfig.imgUrl.trim()) {
                logoImg.src = logoConfig.imgUrl;
                logoImg.style.display = "block";
                logoTxt.style.display = "block";
            } else {
                logoImg.src = "https://picsum.photos/id/20/100/100";
                logoImg.style.display = "block";
                logoTxt.style.display = "block";
            }
            const logoArea = document.getElementById("logoArea");
            logoArea.style.cursor = logoConfig.linkUrl ? "pointer" : "default";
            logoArea.onclick = () => {
                if (logoConfig.linkUrl) window.open(logoConfig.linkUrl, "_blank");
            };
        }
        
        // 上传（需要密码）
        function triggerUpload() {
            pendingAction = "upload";
            document.getElementById("modalActionText").innerText = "请输入上传密码";
            document.getElementById("passwordModal").style.display = "flex";
            document.getElementById("modalPassword").value = "";
        }
        
        async function doUpload(files) {
            for (let f of files) {
                if (!f.name.toLowerCase().endsWith(".mp3")) {
                    showToast("跳过: " + f.name);
                    continue;
                }
                showToast("上传中: " + f.name);
                const resp = await uploadSong(f);
                if (resp.success) showToast("✅ " + resp.name);
                else showToast("❌ 失败: " + resp.error);
            }
            await refreshAll();
        }
        
        // 事件绑定
        function bindEvents() {
            document.getElementById("uploadBtn").onclick = triggerUpload;
            const fileInput = document.getElementById("fileInput");
            fileInput.onchange = async (e) => {
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
                    const percent = (audio.currentTime / audio.duration) * 100;
                    document.getElementById("progressFill").style.width = percent + "%";
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
            
            // 密码弹窗
            const modal = document.getElementById("passwordModal");
            document.getElementById("modalConfirmBtn").onclick = async () => {
                const pwd = document.getElementById("modalPassword").value;
                if (pwd !== ADMIN_PASSWORD) {
                    showToast("密码错误");
                    modal.style.display = "none";
                    pendingAction = null;
                    pendingFiles = null;
                    return;
                }
                if (pendingAction === "upload") {
                    if (pendingFiles && pendingFiles.length) {
                        await doUpload(pendingFiles);
                        pendingFiles = null;
                    }
                } else if (pendingAction && pendingAction.type === "delete") {
                    const result = await deleteSongReq(pendingAction.id, pwd);
                    if (result.success) {
                        showToast("删除成功");
                        await refreshAll();
                    } else {
                        showToast("删除失败: " + (result.error || "未知错误"));
                    }
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
            loadLogoPref();
            bindEvents();
            await refreshAll();
        }
        
        init();
    </script>
</body>
</html>`;

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
        
        // 返回 favicon
        if (path === "/favicon.ico") {
            return new Response(FAVICON_SVG, {
                headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" }
            });
        }
        
        // 获取歌曲列表
        if (path === "/api/songs" && request.method === "GET") {
            try {
                const list = await env.music_kv.list();
                const songs = [];
                for (const key of list.keys) {
                    if (key.name.startsWith("meta_")) continue;
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
        
        // 播放音乐
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
        
        // 上传音乐
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
        
        // 删除音乐
        if (path === "/api/delete" && request.method === "POST") {
            try {
                const { id, password } = await request.json();
                if (password !== ADMIN_PASSWORD) {
                    return Response.json({ success: false, error: "密码错误" }, { headers: corsHeaders });
                }
                await env.music_kv.delete(id);
                await env.music_kv.delete("meta_" + id);
                return Response.json({ success: true }, { headers: corsHeaders });
            } catch (error) {
                return Response.json({ success: false, error: error.message }, { headers: corsHeaders });
            }
        }
        
        // 返回首页
        if (path === "/" || path === "") {
            return new Response(HTML_CONTENT, {
                headers: { "Content-Type": "text/html", ...corsHeaders }
            });
        }
        
        return new Response("Not found", { status: 404 });
    }
};
