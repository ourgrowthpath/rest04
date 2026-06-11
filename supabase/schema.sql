-- ================================================
-- 성장패스 아카데미 게시판 스키마
-- 재실행해도 안전한 버전
-- ================================================

-- posts 테이블
CREATE TABLE IF NOT EXISTS public.posts (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT        NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  content     TEXT        NOT NULL CHECK (char_length(content) >= 1),
  author_id   UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT        NOT NULL,
  views       INT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS 활성화 (이미 켜져 있어도 무시됨)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 정책: 기존 것 제거 후 재생성 (충돌 방지)
DROP POLICY IF EXISTS "posts_select_all"  ON public.posts;
DROP POLICY IF EXISTS "posts_insert_auth" ON public.posts;
DROP POLICY IF EXISTS "posts_update_own"  ON public.posts;
DROP POLICY IF EXISTS "posts_delete_own"  ON public.posts;

CREATE POLICY "posts_select_all"
  ON public.posts FOR SELECT USING (true);

CREATE POLICY "posts_insert_auth"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "posts_update_own"
  ON public.posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "posts_delete_own"
  ON public.posts FOR DELETE
  USING (auth.uid() = author_id);

-- updated_at 자동 갱신 함수 및 트리거
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS posts_set_updated_at ON public.posts;

CREATE TRIGGER posts_set_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
