# chat Edge Function

메인페이지 채팅 위젯(`src/components/ChatWidget.jsx`)이 호출하는 AI 응답 함수.
**Solar(Upstage)** 를 우선 호출하고 실패하면 **OpenAI** 로 폴백한다.
API 키는 브라우저에 노출되지 않고 Supabase 시크릿으로만 보관된다.

## 배포 절차

```bash
# 1. (최초 1회) 프로젝트 연결
npx supabase login
npx supabase link --project-ref vhxvqtbemahbcbrbnkcv

# 2. API 키를 Supabase 시크릿으로 저장 (← "키 값을 Supabase에 저장"하는 부분)
npx supabase secrets set SOLAR_API_KEY="업스테이지_솔라_키"
npx supabase secrets set OPENAI_API_KEY="오픈AI_키"

# 3. 함수 배포 (config.toml 에 verify_jwt=false 설정되어 있어 로그인 없이도 호출 가능)
npx supabase functions deploy chat
```

## 동작 확인

```bash
curl -i -X POST \
  "https://vhxvqtbemahbcbrbnkcv.supabase.co/functions/v1/chat" \
  -H "Content-Type: application/json" \
  -H "apikey: <VITE_SUPABASE_ANON_KEY>" \
  -d '{"messages":[{"role":"user","content":"강의 종류 알려줘"}]}'
```

## 선택적 환경변수 (기본값 변경 시 `supabase secrets set` 으로 지정)

| 변수 | 기본값 |
| --- | --- |
| `SOLAR_API_URL` | `https://api.upstage.ai/v1/chat/completions` |
| `SOLAR_MODEL` | `solar-pro2` |
| `OPENAI_API_URL` | `https://api.openai.com/v1/chat/completions` |
| `OPENAI_MODEL` | `gpt-4o-mini` |

> Solar 모델명/엔드포인트는 Upstage 콘솔의 현재 사용 가능 모델로 맞춰주세요.
> 키를 하나만 설정해도 동작합니다(Solar만 설정 시 폴백 없이 Solar만 사용).
