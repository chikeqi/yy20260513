// _worker.js - 一个文件搞定所有功能
const ADMIN_PASSWORD = "ww123456";

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        
        // 获取歌曲列表
        if (path === "/api/songs" && request.method === "GET") {
            const list = await env.music_kv.list();
            const songs = [];
            for (const key of list.keys) {
                if (key.name.startsWith('meta_')) continue;
                const meta = await env.music_kv.get(`meta_${key.name}`, 'json');
                songs.push({
                    id: key.name,
                    name: meta?.name || key.name.replace(/^\d+_/, '').replace(/\.mp3$/, ''),
                    url: `/api/play/${key.name}`
                });
            }
            return Response.json({ songs: songs.reverse() });
        }
        
        // 播放音乐
        if (path.startsWith("/api/play/")) {
            const id = path.replace("/api/play/", "");
            const audio = await env.music_kv.get(id, { type: 'arrayBuffer' });
            if (!audio) return new Response("Not found", { status: 404 });
            return new Response(audio, { headers: { "Content-Type": "audio/mpeg" } });
        }
        
        // 上传音乐
        if (path === "/api/upload" && request.method === "POST") {
            const formData = await request.formData();
            const file = formData.get("song");
            if (!file || !file.name.endsWith('.mp3')) {
                return Response.json({ success: false, error: "请上传 MP3 文件" });
            }
            const id = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.]/g, '_');
            const buffer = await file.arrayBuffer();
            await env.music_kv.put(id, buffer);
            await env.music_kv.put(`meta_${id}`, JSON.stringify({
                name: file.name.replace(/\.mp3$/, ''),
                uploadTime: Date.now()
            }));
            return Response.json({ success: true, name: file.name });
        }
        
        // 删除音乐
        if (path === "/api/delete" && request.method === "POST") {
            const { id, password } = await request.json();
            if (password !== ADMIN_PASSWORD) {
                return Response.json({ success: false, error: "密码错误" });
            }
            await env.music_kv.delete(id);
            await env.music_kv.delete(`meta_${id}`);
            return Response.json({ success: true });
        }
        
        // 返回首页
        if (path === "/" || path === "") {
            return new Response(await getIndexHtml(), {
                headers: { "Content-Type": "text/html" }
            });
        }
        
        return new Response("Not found", { status: 404 });
    }
};

async function getIndexHtml() {
    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>我的音乐站</title>
<style>
body{font-family:system-ui;max-width:600px;margin:0 auto;padding:20px;background:#0f172a;color:white;}
.upload-btn{background:#3b82f6;padding:12px 24px;border-radius:30px;cursor:pointer;display:inline-block;margin:20px 0;}
#fileInput{display:none;}
.song{background:#1e293b;padding:10px;margin:8px 0;border-radius:12px;display:flex;justify-content:space-between;align-items:center;}
button{background:#3b82f6;border:none;padding:6px 12px;border-radius:20px;color:white;cursor:pointer;margin-left:8px;}
.delete{background:#ef4444;}
audio{width:100%;margin-top:20px;}
</style>
</head>
<body>
<h1>🎵 我的音乐库</h1>
<div class="upload-btn" id="uploadBtn">📤 上传 MP3 音乐</div>
<input type="file" id="fileInput" accept="audio/mpeg" multiple>
<div id="songList"></div>
<audio id="audioPlayer" controls style="display:none;"></audio>
<script>
const ADMIN_PASSWORD = "music2025";
async function loadSongs(){
    const res=await fetch('/api/songs');
    const data=await res.json();
    const container=document.getElementById('songList');
    container.innerHTML='';
    data.songs.forEach(song=>{
        const div=document.createElement('div');
        div.className='song';
        div.innerHTML=\`<span>🎵 \${song.name}</span><div><button onclick="playSong('\${song.url}')">播放</button><button class="delete" onclick="deleteSong('\${song.id}')">删除</button></div>\`;
        container.appendChild(div);
    });
}
function playSong(url){ const audio=document.getElementById('audioPlayer'); audio.src=url; audio.style.display='block'; audio.play(); }
async function deleteSong(id){
    const pwd=prompt('请输入删除密码');
    if(pwd!==ADMIN_PASSWORD){ alert('密码错误'); return; }
    const res=await fetch('/api/delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,password:pwd})});
    const result=await res.json();
    if(result.success){ alert('删除成功'); loadSongs(); } else { alert('删除失败：'+result.error); }
}
document.getElementById('uploadBtn').onclick=()=>{ document.getElementById('fileInput').click(); };
document.getElementById('fileInput').onchange=async (e)=>{
    const files=e.target.files;
    for(let file of files){
        const formData=new FormData();
        formData.append('song',file);
        const res=await fetch('/api/upload',{method:'POST',body:formData});
        const result=await res.json();
        alert(result.success?\`✅ \${result.name} 上传成功\`:\`❌ 上传失败\`);
    }
    loadSongs();
    e.target.value='';
};
loadSongs();
</script>
</body>
</html>`;
}
