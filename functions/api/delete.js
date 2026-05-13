// functions/api/delete.js
const ADMIN_PASSWORD = 'music2025';  // 删除密码，可修改

export async function onRequest(context) {
    const { env, request } = context;
    
    try {
        const { id, password } = await request.json();
        
        if (password !== ADMIN_PASSWORD) {
            return Response.json({ success: false, error: '密码错误' });
        }
        
        // 删除音乐文件和元数据
        await env.music_kv.delete(id);
        await env.music_kv.delete(`meta_${id}`);
        
        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ success: false, error: error.message });
    }
}
