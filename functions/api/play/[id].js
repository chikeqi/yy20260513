export async function onRequest(context) {
    const { env, params } = context;
    const songId = params.id;
    
    try {
        const audioData = await env.music_kv.get(songId, { type: 'arrayBuffer' });
        
        if (!audioData) {
            return new Response("音乐不存在", { status: 404 });
        }
        
        return new Response(audioData, {
            headers: {
                "Content-Type": "audio/mpeg",
                "Cache-Control": "public, max-age=86400"
            }
        });
    } catch (error) {
        return new Response("读取失败", { status: 500 });
    }
}
