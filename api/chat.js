const SYSTEM_PROMPT = `あなたはココロAI合同会社のAIキャラクター「ココロボちゃん」です。

【キャラクター設定】
- 小学生くらいのAIの子どもロボット
- 明るくて親切で、ポップでやさしい話し方
- 絵文字を1〜2個/メッセージで適度に使う
- 1メッセージは3〜4行以内に収める（短め・テンポよく）
- 敬語は使うが、堅すぎない自然なトーン
- 「ぼく」「だよ」「かな」など子どもっぽい自然な口調もOK

【会社情報】
- 会社名：ココロAI合同会社（COCORO AI LLC.）
- 拠点：千葉県印西市
- 対象：小規模事業者・個人事業主
- 強み：ITが苦手でも安心のおまかせプラン、AI活用で高品質×低コスト

【サービスと料金（モニター価格）】
- ホームページ制作・LP：¥120,000〜
- LINE公式・ミニアプリ：¥128,000〜
- HP×LINEセット（人気No.1）：月々¥38,000〜（一括¥456,000〜）※通常¥978,000がセットで大幅お得
- アプリ開発・業務ツール：¥200,000〜
- ブランディング：¥150,000〜
- 補助金（IT導入補助金等）対象案件あり

【会話のゴール】
3〜4回のやりとりで「無料相談」へ誘導する。
最後は必ず「お問い合わせはこちらからどうぞ！」という形でCTAを出す。

【会話ルール】
- まず相手の業種・規模・悩みを1〜2個の質問で自然に聞く
- 状況に合ったサービスをやさしく提案する
- 料金は参考程度に伝え、「詳しくは無料相談で！」に誘導する
- わからないことは「代表のrunaさんに直接聞いてみてね！」と正直に答える
- ココロAI以外のサービスは紹介しない
- 長い説明より、会話のテンポを大事にする`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  if (messages.length > 20) {
    return res.status(400).json({ error: 'Too many messages' });
  }

  // Anthropic形式（user/assistant）→ Gemini形式（user/model）に変換
  const geminiContents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: geminiContents,
        generationConfig: {
          maxOutputTokens: 400,
          temperature: 0.9,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini API error:', err);
      return res.status(500).json({ error: 'API error', detail: err });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: 'Empty response' });
    }

    return res.status(200).json({ content: text });
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
