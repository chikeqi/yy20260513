// functions/api/songs.js
export async function onRequest(context) {
    const { env } = context;
    
    try {
        const list = await env.music_kv.list();
        const songs = [];
        
        for (const key of list.keys) {
            // 跳过元数据key（以meta_开头的）
            if (key.name.startsWith('meta_')) continue;
            
            const metaKey = `meta_${key.name}`;
            let metadata = await env.music_kv.get(metaKey, 'json');
            
            if (!metadata) {
                // 如果没有元数据，创建默认的
                metadata = {
                    name: key.name.replace(/\.mp3$/, '').replace(/_\d+_/, ''),
                    artist: '未知歌手',
                    cover: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/100/100`
                };
            }
            
            songs.push({
                id: key.name,
                name: metadata.name,
                artist: metadata.artist,
                cover: metadata.cover,
                url: `/api/play/${encodeURIComponent(key.name)}`
            });
        }
        
        // 按上传时间倒序
        songs.reverse();
        
        return Response.json({ success: true, songs });
    } catch (error) {
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
