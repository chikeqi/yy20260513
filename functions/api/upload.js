// functions/api/upload.js
export async function onRequest(context) {
    const { env, request } = context;
    
    try {
        const formData = await request.formData();
        const songFile = formData.get('song');
        
        if (!songFile || !songFile.name.endsWith('.mp3')) {
            return Response.json({ success: false, error: '请上传 MP3 文件' });
        }
        
        // 生成唯一ID
        const timestamp = Date.now();
        const cleanName = songFile.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5.]/g, '_');
        const songId = `${timestamp}_${cleanName}`;
        
        // 读取文件内容
        const songBuffer = await songFile.arrayBuffer();
        
        // 存入 KV
        await env.music_kv.put(songId, songBuffer);
        
        // 存入元数据
        const songName = songFile.name.replace(/\.mp3$/i, '');
        await env.music_kv.put(`meta_${songId}`, JSON.stringify({
            name: songName,
            artist: formData.get('artist') || '上传者',
            cover: formData.get('cover') || `https://picsum.photos/id/${Math.floor(Math.random() * 100 + 10)}/100/100`,
            uploadTime: timestamp
        }));
        
        return Response.json({ success: true, name: songName, id: songId });
    } catch (error) {
        return Response.json({ success: false, error: error.message });
    }
}
