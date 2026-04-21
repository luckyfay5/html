export default async function handler(req, res) {
    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '只允许 POST 请求' });
    }

    // 从 Vercel 环境变量里拿到你的密钥
    const apiKey = process.env.GEMINI_API_KEY;
    
    // 如果你在 Vercel 里没配置好密钥，就报错提示
    if (!apiKey) {
        return res.status(500).json({ error: '服务器未配置 API Key，请联系管理员' });
    }

    try {
        // 替前端向 Google 发送请求
        // 换成 2.0 版本，通常网络情况会好很多
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) // 把前端发来的参数原样传给 Google
        });

        // 检查 Google 的响应状态
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Google API 报错: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        
        // 把结果返回给前端网页
        return res.status(200).json(data);
        
    } catch (error) {
        console.error('代理出错:', error);
        return res.status(500).json({ error: error.message });
    }
}
