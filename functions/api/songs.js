export async function onRequest(context) {
    const { env } = context;
    
    try {
        const list = await env.music_kv.list();
        const songs = [];
        
        for (const key of list.keys) {
            if (key.name.startsWith('meta_')) continue;
            
            const metaKey = `meta_${key.name}`;
            let metadata = await env.music_kv.get(metaKey, 'json');
            
            if (!metadata) {
                metadata = {
                    name: decodeURIComponent(key.name.replace(/^\d+_/, '').replace(/\.mp3$/, '')),
                    artist: '未知歌手',
                    cover: 'https://picsum.photos/id/1/100/100'
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
        
        songs.reverse();
        return Response.json({ success: true, songs });
    } catch (error) {
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
