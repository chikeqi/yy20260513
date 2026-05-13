// functions/api/upload.js
export async function onRequest(context) {
    const { env, request } = context;
    
    // 只处理 POST 请求
    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }
    
    try {
        // 从 FormData 中获取文件
        const formData = await request.formData();
        const songFile = formData.get("song");
        
        // 验证文件
        if (!songFile || !songFile.name || !songFile.name.toLowerCase().endsWith('.mp3')) {
            return Response.json({ 
                success: false, 
                error: "请上传有效的 MP3 文件" 
            });
        }
        
        // 生成唯一 ID
        const timestamp = Date.now();
        const cleanName = songFile.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5.]/g, '_');
        const songId = `${timestamp}_${cleanName}`;
        
        // 获取文件内容（作为 ArrayBuffer）
        const fileBuffer = await songFile.arrayBuffer();
        
        // 直接存储二进制数据到 KV
        await env.music_kv.put(songId, fileBuffer, {
            expirationTtl: 31536000  // 1年有效期
        });
        
        // 保存元数据
        const songName = songFile.name.replace(/\.mp3$/i, '');
        await env.music_kv.put(`meta_${songId}`, JSON.stringify({
            name: songName,
            artist: "上传者",
            cover: `https://picsum.photos/id/${Math.floor(Math.random() * 100 + 10)}/100/100`,
            uploadTime: timestamp
        }));
        
        return Response.json({ 
            success: true, 
            name: songName, 
            id: songId 
        });
        
    } catch (error) {
        console.error("上传错误:", error);
        return Response.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}
