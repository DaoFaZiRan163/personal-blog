---
name: blog-autopilot
description: >
  Fully automated blog post generator for 邵炎炎's personal blog (D:\CodeX\personal-blog).
  Use this skill whenever the user says things like "生成博文", "写一篇博客", "更新博客", "帮我写篇文章",
  or asks to run the blog autopilot workflow. The skill handles everything end-to-end:
  reading the knowledge source list, scanning live sources for hot topics, checking existing
  posts to avoid duplicates, confirming the topic with the user, deep-researching with real
  sources, writing a properly styled HTML post, and updating blog.html with featured-post rotation.
  Do not wait for the user to specify a topic — discover it from the sources.
---

# Blog Autopilot — 邵炎炎个人博客

## Overview

This skill automates the full cycle of writing a new blog post:

1. **Scout** — read the knowledge source list, fetch live content from each source
2. **Filter** — compare hot topics against existing posts, exclude duplicates
3. **Confirm** — present 3 candidate topics to the user via AskUserQuestion
4. **Research** — deep-dive the chosen topic using the same sources
5. **Write** — produce a complete HTML post that matches the blog's exact style
6. **Publish** — update blog.html: promote new post to featured, demote old featured to the regular list

Work through each phase sequentially. Never skip the user confirmation step (Step 3).

---

## Phase 1 — Read the Knowledge Source List

The knowledge source list lives at:
```
D:\CodeX\personal-blog\知识源列表.md
```

Read this file first. It contains ~41 numbered sources across five categories:
- 前沿模型与技术动态 (HN, HuggingFace, Simon Willison, arXiv, etc.)
- 行业落地案例 (a16z, Latent Space, Sequoia, etc.)
- 工程实践与工具链 (GitHub Trending, Anthropic/OpenAI Cookbook, Eugene Yan, Hamel, etc.)
- 中文圈 (量子位, 极客公园, 机器之心, 晚点, etc.)
- FDE 暗信息源 (竞品 changelog, 客户招聘 JD, etc.)

Extract every source's URL and frequency tag (每日/每周/每月/按需).

---

## Phase 2 — Scan Sources for Hot Topics

Run parallel WebSearch calls covering the high-signal sources. Prioritise **每日** and **每周** sources because they carry the freshest signal. Suggested query patterns:

```
site:simonwillison.net 2026 May          # Simon Willison latest
site:news.ycombinator.com AI 2026 May    # HN top AI discussions
site:huggingface.co/papers 2026 May      # HF daily papers
site:a16z.com AI enterprise 2026 May     # a16z latest
site:latent.space 2026 May               # Latent Space latest
site:qbitai.com 2026年5月                # 量子位
site:eugeneyan.com OR site:hamel.dev 2026 May   # engineering blogs
```

Collect 8–12 distinct hot signals across the source categories. For each, note:
- Source name (from the knowledge list)
- Topic / headline
- Why it's hot (discussion volume, recency, cross-source mentions)

---

## Phase 3 — Filter Against Existing Posts

Scan existing post titles so you don't duplicate covered ground:

```bash
grep -h "<title>" /sessions/magical-adoring-ramanujan/mnt/personal-blog/posts/*.html \
  | sed 's/.*<title>\(.*\)<\/title>.*/\1/'
```

Cross-reference the hot signals against these titles. Drop any topic that is substantially covered by an existing post. From what remains, pick the **3 strongest candidates** that best match the blog's identity.

### Blog identity / author positioning

- **Role**: Forward Deployed Engineer (FDE) — enterprise AI deployment specialist
- **Three content pillars**: 前沿技术落地 · 工程实践 · AI 产品思维
- **Audience**: Chinese-speaking AI engineers, PMs, and enterprise tech leads
- **Voice**: Practitioner-first — first-person experience, concrete examples, no pure theory
- A good topic has a *fresh angle* (new paper, new tool, new data point) AND is directly useful to an FDE on a client engagement

Present 3 candidates to the user with one sentence each explaining the source and why it fits.

---

## Phase 4 — Confirm Topic with User

Use **AskUserQuestion** with the 3 candidates as options. Do not skip this step. The user selects one; you proceed with that selection.

---

## Phase 5 — Deep Research

Once a topic is confirmed, run 3–5 more targeted WebSearch queries to gather:
- Primary source material (original paper / article / data)
- Supporting evidence (data points, quotes, real numbers)
- Practitioner perspectives (HN comments, engineering blog takes)
- Counter-arguments or nuance worth including

Take notes on the strongest facts, frameworks, and examples before writing.

---

## Phase 6 — Write the HTML Post

### File naming

Slug: lowercase, hyphen-separated, descriptive. Save to:
```
D:\CodeX\personal-blog\posts\<slug>.html
```

### Required HTML structure

Follow this skeleton exactly — do not deviate from element names or CSS classes:

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="[SEO description, 60–100 chars]">
  <title>[Post title] — 邵炎炎</title>
  <link rel="stylesheet" href="../styles.css">
  <link rel="stylesheet" href="../post-shared.css">
</head>
<body>
<!-- NAV (copy verbatim) -->
<nav class="site-nav">
  <div class="nav-inner">
    <a class="nav-brand" href="../index.html">
      <span class="dot"><img src="../avatar.jpg" alt="邵炎炎" onerror="this.style.display='none'"></span>邵炎炎
    </a>
    <button class="nav-toggle" type="button" aria-label="Menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <div class="nav-links">
      <a href="../index.html">首页</a>
      <a href="../about.html">关于我</a>
      <a href="../projects.html">项目</a>
      <a href="../blog.html" class="active">博客</a>
      <a href="mailto:shaoyanyan91@163.com" class="nav-cta">联系我</a>
    </div>
  </div>
</nav>

<main>
<section class="section container">
  <div class="post-header">
    <div class="post-meta-row">
      <a href="../blog.html" style="font-size:13px;color:var(--text-3);display:flex;align-items:center;gap:4px;">← 所有文章</a>
      <span style="color:var(--border);">|</span>
      <span class="post-meta-tag">[Category tag]</span>
      <time class="post-meta-date" datetime="YYYY-MM-DD">YYYY年M月D日 · 约 N 分钟阅读</time>
    </div>
    <h1>[Post title]</h1>
    <p class="post-lead">[Lead paragraph — 2–3 sentences, frame the problem and the practitioner's perspective]</p>
  </div>

  <div class="post-layout">
    <article class="post-body">
      <div class="prose">
        <!-- CONTENT: h2 sections, prose paragraphs, panels, callouts, tables -->
      </div>
    </article>

    <aside class="post-sidebar">
      <div class="toc">
        <div class="toc-title">目录</div>
        <div class="toc-list">
          <a href="#section-id">Section title</a>
          <!-- one link per h2 -->
        </div>
      </div>
      <div class="sidebar-card results-card">
        <div class="sidebar-card-title">关键数据</div>
        <div class="metric-line"><strong>[number]</strong><span>[label]</span></div>
        <!-- 3 data points from the research -->
      </div>
      <div class="sidebar-card author-card">
        <div class="sidebar-card-title">作者</div>
        <div class="author-mini">
          <img src="../avatar.jpg" alt="邵炎炎">
          <div><strong>邵炎炎</strong><span>FDE · AI 产品经理</span></div>
        </div>
        <a class="btn btn-secondary" href="../about.html"
           style="width:100%;justify-content:center;font-size:12px;padding:9px 12px;">查看完整经历 →</a>
      </div>
      <div class="sidebar-card related-card">
        <div class="sidebar-card-title">相关文章</div>
        <!-- 3 related posts — pick the most thematically close existing posts -->
        <a class="related-post" href="[slug].html">
          <div>
            <div class="related-post-title">[Title]</div>
            <div class="related-post-meta">
              <div class="related-post-cat">[Category]</div>
              <div class="related-post-date">[YYYY.MM.DD]</div>
            </div>
          </div>
        </a>
      </div>
    </aside>
  </div>
</section>
</main>

<footer class="site-footer">
  <div class="footer-inner">
    <p>&copy; 2026 邵炎炎 · 用写作整理思考，用代码验证想法</p>
    <div class="footer-links">
      <a href="../about.html">关于</a>
      <a href="../projects.html">项目</a>
      <a href="../blog.html">博客</a>
      <a href="mailto:shaoyanyan91@163.com" class="footer-cta">联系我</a>
    </div>
  </div>
</footer>
<script src="../nav.js"></script>
</body>
</html>
```

### Content components

Use these reusable components inside `.prose`:

**Info panel** (for lists of 3–5 structured items):
```html
<div class="post-panel">
  <div class="panel-row">
    <div class="panel-label">Label</div>
    <div class="panel-desc">Description text</div>
  </div>
</div>
```

**Callout** (for a key insight or warning):
```html
<div class="callout">
  <div class="callout-title">Title</div>
  Body text.
</div>
```

**Comparison table**:
```html
<table class="post-table">
  <thead><tr><th>Col A</th><th>Col B</th><th>Col C</th></tr></thead>
  <tbody>
    <tr><td>...</td><td>...</td><td>...</td></tr>
  </tbody>
</table>
```

**Blockquote** (for a key thesis statement):
```html
<blockquote>One punchy sentence that captures the post's central argument.</blockquote>
```

**Code block**:
```html
<pre><code>your code here</code></pre>
```

### Content quality checklist

Before saving the file, verify:
- [ ] Minimum 6 h2 sections (including a closing 总结 section)
- [ ] At least one panel, one blockquote, and one callout or table
- [ ] Every h2 has an `id` attribute matching its TOC link
- [ ] Sidebar has 3 real data points pulled from the research
- [ ] Post ends with contact email + copyright line
- [ ] Reading time estimate is roughly accurate (250 chars/min ≈ 8 min for ~2000 chars)

---

## Phase 7 — Update blog.html

### What needs to change

`blog.html` has one **featured card** (dark background, full-width, `class="blog-card featured"`, `grid-column: span 3`). The new post should become the new featured card. The old featured card should be **demoted to a regular card** and placed at the top of the regular grid.

### Step-by-step

**1. Read the current featured card** from blog.html — it's the `<a class="blog-card featured" ...>` element. Extract its `href`, category, title, description, date.

**2. Build the new featured card** for the new post. Use this template:

```html
<a class="blog-card featured" href="posts/[new-slug].html" data-cat="[cat]">
  <div class="featured-left">
    <div><span class="blog-cat [cat-class]">[Category]</span></div>
    <h2>[Post title]</h2>
    <p>[1–2 sentence description]</p>
    <span class="blog-read-more">阅读全文 →</span>
    <span class="blog-date" style="margin-top:4px;">YYYY.MM.DD · 约 N 分钟阅读</span>
  </div>
  <div class="featured-right">
    <div class="feat-stat">
      <div class="feat-stat-val">[Key number]</div>
      <div class="feat-stat-label">[Label]</div>
    </div>
    <div class="feat-stat">
      <div class="feat-stat-val">[Key number]</div>
      <div class="feat-stat-label">[Label]</div>
    </div>
    <div class="feat-stat">
      <div class="feat-stat-val">[Key number]</div>
      <div class="feat-stat-label">[Label]</div>
    </div>
  </div>
</a>
```

Category class mapping: `fde` → `blog-cat fde`, `ai` → `blog-cat`, `pm` → `blog-cat pm`, `arch` → `blog-cat arch`

**3. Build the demoted regular card** for the old featured post:

```html
<a class="blog-card" href="[old-featured-href]" data-cat="[old-cat]">
  <span class="blog-cat [old-cat-class]">[Old category]</span>
  <h2>[Old featured title]</h2>
  <p>[Old featured description — shorten if needed to ~40 words]</p>
  <span class="blog-read-more">阅读全文 →</span>
  <span class="blog-date">[Old date]</span>
</a>
```

**4. Apply edits to blog.html** using the Edit tool:
- Replace the entire old `<a class="blog-card featured" ...>...</a>` block with the new featured card
- Insert the demoted regular card immediately after the new featured card (before the first existing regular card)

**5. Verify** by reading back the relevant section of blog.html and confirming:
- Exactly one element has `class="blog-card featured"`
- The new post appears as the featured card
- The old featured post appears as a regular card right below it

---

## Phase 8 — Confirm and Report

After saving both files, provide:
- A `computer://` link to the new post HTML
- A `computer://` link to the updated blog.html
- A one-paragraph summary of what the post covers and why this topic was chosen from the knowledge sources

Sources used for the post should be listed at the end (markdown hyperlinks from WebSearch results).
