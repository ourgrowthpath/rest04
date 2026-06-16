// 성장패스 아카데미 - AI 채팅 Edge Function
// Solar(Upstage) API를 우선 호출하고, 실패 시 OpenAI로 폴백한다.
// API 키는 Supabase 시크릿(SOLAR_API_KEY / OPENAI_API_KEY)으로만 보관하며
// 브라우저에는 절대 노출되지 않는다.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SYSTEM_PROMPT = `당신은 '성장패스 아카데미(GrowthPath Academy)'의 친절한 AI 상담 도우미입니다.
성장패스 아카데미는 AI 기술과 AI 리터러시 교육을 제공하는 온라인 교육 플랫폼입니다.

제공 정보:
- 강의: AI 동영상(딥러닝·신경망·트랜스포머 등), AI 리터러시(ChatGPT 업무 활용·프롬프트·AI 윤리 등)
- 기능: 동영상 강의 시청, 게시판, 이메일/카카오 회원가입·로그인
- 문의처: info@growthpath.kr

방문자의 질문에 한국어로 친절하고 간결하게 답하세요.
확실하지 않은 정보는 지어내지 말고 문의처(info@growthpath.kr) 안내로 마무리하세요.`

const MAX_HISTORY = 12 // 시스템 메시지 제외, 최근 대화만 전달

async function callChatAPI(
  url: string,
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[],
): Promise<string> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`)
  }

  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content?.trim()
  if (!content) throw new Error('빈 응답')
  return content
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return json({ error: 'POST 요청만 허용됩니다.' }, 405)
  }

  console.log('[syu-chat] 요청 수신', {
    hasSolar: !!Deno.env.get('SOLAR_API_KEY'),
    hasOpenAI: !!Deno.env.get('OPENAI_API_KEY'),
  })

  let messages: { role: string; content: string }[]
  try {
    const body = await req.json()
    messages = body?.messages
    if (!Array.isArray(messages)) throw new Error()
  } catch {
    return json({ error: 'messages 배열이 필요합니다.' }, 400)
  }

  const history = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && m.content)
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: String(m.content) }))

  const chatMessages = [{ role: 'system', content: SYSTEM_PROMPT }, ...history]

  const solarKey = Deno.env.get('SOLAR_API_KEY')
  const openaiKey = Deno.env.get('OPENAI_API_KEY')
  const solarUrl = Deno.env.get('SOLAR_API_URL') ?? 'https://api.upstage.ai/v1/chat/completions'
  const solarModel = Deno.env.get('SOLAR_MODEL') ?? 'solar-pro2'
  const openaiUrl = Deno.env.get('OPENAI_API_URL') ?? 'https://api.openai.com/v1/chat/completions'
  const openaiModel = Deno.env.get('OPENAI_MODEL') ?? 'gpt-4o-mini'

  const errors: string[] = []

  // 1) Solar (메인)
  if (solarKey) {
    try {
      const reply = await callChatAPI(solarUrl, solarKey, solarModel, chatMessages)
      return json({ reply, provider: 'solar', model: solarModel })
    } catch (e) {
      errors.push(`solar: ${(e as Error).message}`)
    }
  } else {
    errors.push('solar: SOLAR_API_KEY 미설정')
  }

  // 2) OpenAI (폴백)
  if (openaiKey) {
    try {
      const reply = await callChatAPI(openaiUrl, openaiKey, openaiModel, chatMessages)
      return json({ reply, provider: 'openai', model: openaiModel })
    } catch (e) {
      errors.push(`openai: ${(e as Error).message}`)
    }
  } else {
    errors.push('openai: OPENAI_API_KEY 미설정')
  }

  console.error('chat function failed:', errors.join(' | '))
  return json({ error: '죄송합니다. 답변 생성에 실패했어요. 잠시 후 다시 시도해 주세요.' }, 502)
})
