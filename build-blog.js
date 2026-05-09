const fs   = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

// ── Static files to copy into _site ──────────────────────────────────────────
const SITE_FILES = [
  'index.html','about.html','services.html','contact.html',
  'ai-governance-policy-support.html','ai-training-for-businesses.html',
  'chatgpt-copilot-training.html','community-ai-training.html',
  'digital-transformation-consulting.html','style.css','robots.txt',
  'googlee5b9f85818d9ffd8.html'
];

const BASE_URL = 'https://orchestratedigital.co.uk';

// Static pages for sitemap (path, priority, changefreq)
const STATIC_PAGES = [
  { path: '/',                                    priority: '1.0', changefreq: 'weekly'  },
  { path: '/services.html',                       priority: '0.9', changefreq: 'monthly' },
  { path: '/about.html',                          priority: '0.7', changefreq: 'monthly' },
  { path: '/contact.html',                        priority: '0.8', changefreq: 'monthly' },
  { path: '/blog/',                               priority: '0.9', changefreq: 'weekly'  },
  { path: '/ai-training-for-businesses.html',     priority: '0.8', changefreq: 'monthly' },
  { path: '/digital-transformation-consulting.html', priority: '0.8', changefreq: 'monthly' },
  { path: '/chatgpt-copilot-training.html',       priority: '0.8', changefreq: 'monthly' },
  { path: '/community-ai-training.html',          priority: '0.7', changefreq: 'monthly' },
  { path: '/ai-governance-policy-support.html',   priority: '0.8', changefreq: 'monthly' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

// ── Shared nav / footer ───────────────────────────────────────────────────────
const NAV = `
  <header>
    <nav class="container">
      <a href="/index.html" class="logo">
        <div class="logo-icon">
          <svg width="48" height="28" viewBox="0 0 120 60" fill="none">
            <path d="M 0,30 C 10,14 20,14 30,30 C 40,46 50,46 60,30 C 70,14 80,14 90,30 C 100,46 110,46 120,30" stroke="#9BE8FF" stroke-width="1.2" fill="none" opacity="0.45"/>
            <path d="M 0,30 C 15,8 30,8 45,30 C 60,52 75,52 90,30 C 105,8 115,8 120,30" stroke="#FFD580" stroke-width="1.6" fill="none" opacity="0.55"/>
            <path d="M 0,30 C 30,1 60,1 60,30 C 60,59 90,59 120,30" stroke="white" stroke-width="3" fill="none"/>
            <circle cx="30" cy="1" r="3" fill="white"/>
            <circle cx="90" cy="59" r="3" fill="white"/>
          </svg>
        </div>
        <div style="line-height:1.15;">
          <div><strong style="color:var(--primary);">Orchestrate</strong> <span style="color:var(--text-dark);">Digital</span></div>
          <div style="font-size:0.6rem;color:var(--text-light);font-weight:500;letter-spacing:0.6px;margin-top:1px;">North East England</div>
        </div>
      </a>
      <button class="nav-toggle" onclick="toggleNav()" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links" id="navLinks">
        <li><a href="/index.html">Home</a></li>
        <li><a href="/services.html">Services</a></li>
        <li><a href="/about.html">About</a></li>
        <li><a href="/blog/" class="active">Blog</a></li>
        <li><a href="/contact.html" class="nav-cta">Get in Touch</a></li>
      </ul>
    </nav>
  </header>`;

const FOOTER = `
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="/index.html" class="logo" style="margin-bottom:18px;display:flex;">
            <div class="logo-icon">
              <svg width="48" height="28" viewBox="0 0 120 60" fill="none">
                <path d="M 0,30 C 10,14 20,14 30,30 C 40,46 50,46 60,30 C 70,14 80,14 90,30 C 100,46 110,46 120,30" stroke="#9BE8FF" stroke-width="1.2" fill="none" opacity="0.45"/>
                <path d="M 0,30 C 15,8 30,8 45,30 C 60,52 75,52 90,30 C 105,8 115,8 120,30" stroke="#FFD580" stroke-width="1.6" fill="none" opacity="0.55"/>
                <path d="M 0,30 C 30,1 60,1 60,30 C 60,59 90,59 120,30" stroke="white" stroke-width="3" fill="none"/>
                <circle cx="30" cy="1" r="3" fill="white"/>
                <circle cx="90" cy="59" r="3" fill="white"/>
              </svg>
            </div>
            <div style="line-height:1.15;">
              <div><strong style="color:var(--primary);">Orchestrate</strong> <span style="color:white;">Digital</span></div>
              <div style="font-size:0.6rem;color:rgba(255,255,255,0.4);font-weight:500;letter-spacing:0.6px;margin-top:1px;">North East England</div>
            </div>
          </a>
          <p>Helping small and medium-sized businesses across North East England, North Yorkshire and Cumbria adopt AI and digital technology to improve performance and productivity.</p>
        </div>
        <div class="footer-links">
          <h4>Navigate</h4>
          <ul>
            <li><a href="/index.html">Home</a></li>
            <li><a href="/services.html">Services</a></li>
            <li><a href="/about.html">About</a></li>
            <li><a href="/blog/">Blog</a></li>
            <li><a href="/contact.html">Contact</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>Services</h4>
          <ul>
            <li><a href="/ai-training-for-businesses.html">AI Training for Businesses</a></li>
            <li><a href="/digital-transformation-consulting.html">Digital Transformation</a></li>
            <li><a href="/chatgpt-copilot-training.html">AI Tools Training</a></li>
            <li><a href="/ai-governance-policy-support.html">AI Governance &amp; Policy Support</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${new Date().getFullYear()} Orchestrate Digital. All rights reserved.</span>
        <span>orchestratedigital.co.uk</span>
      </div>
    </div>
  </footer>`;

const PAGE_SCRIPT = `
  <script>
    function toggleNav() {
      document.getElementById('navLinks').classList.toggle('open');
    }
    const revealEls = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
    }, { threshold: 0.1 });
    revealEls.forEach(el => observer.observe(el));
  </script>`;

// ── Blog post template ────────────────────────────────────────────────────────
function renderPost(post) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title} | Orchestrate Digital</title>
  <meta name="description" content="${(post.description || '').replace(/"/g, '&quot;')}">
  <meta property="og:title" content="${post.title} | Orchestrate Digital">
  <meta property="og:description" content="${(post.description || '').replace(/"/g, '&quot;')}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://orchestratedigital.co.uk/blog/${post.slug}.html">
  <meta property="og:site_name" content="Orchestrate Digital">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${post.title} | Orchestrate Digital">
  <meta name="twitter:description" content="${(post.description || '').replace(/"/g, '&quot;')}">
  <link rel="canonical" href="https://orchestratedigital.co.uk/blog/${post.slug}.html">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${post.title.replace(/"/g, '\\"')}",
    "description": "${(post.description || '').replace(/"/g, '\\"')}",
    "datePublished": "${new Date(post.date).toISOString().split('T')[0]}",
    "author": {"@type": "Organization", "name": "Orchestrate Digital", "url": "https://orchestratedigital.co.uk"},
    "publisher": {"@type": "Organization", "name": "Orchestrate Digital", "url": "https://orchestratedigital.co.uk"},
    "mainEntityOfPage": {"@type": "WebPage", "@id": "https://orchestratedigital.co.uk/blog/${post.slug}.html"}
  }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css">
  <style>
    .blog-hero { background: linear-gradient(145deg,#060E0D,#0C1C19); padding: 80px 0 52px; border-bottom: 1px solid rgba(26,158,138,0.15); }
    .blog-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
    .blog-tag { background: rgba(26,158,138,0.15); color: var(--primary); padding: 4px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; }
    .blog-date { font-size: 0.87rem; color: var(--text-medium); }
    .blog-title { font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 800; line-height: 1.2; color: var(--text-dark); max-width: 820px; }
    .blog-description { font-size: 1.1rem; color: var(--text-medium); max-width: 700px; margin-top: 16px; line-height: 1.7; }
    .blog-body { padding: 64px 0 96px; }
    .blog-content { max-width: 780px; }
    .blog-content h2 { font-size: 1.55rem; font-weight: 700; color: var(--text-dark); margin: 48px 0 16px; line-height: 1.3; }
    .blog-content h3 { font-size: 1.2rem; font-weight: 600; color: var(--primary); margin: 36px 0 10px; }
    .blog-content p { font-size: 1rem; line-height: 1.85; color: var(--text-medium); margin-bottom: 20px; }
    .blog-content ul, .blog-content ol { color: var(--text-medium); line-height: 1.8; margin-bottom: 20px; padding-left: 24px; }
    .blog-content li { margin-bottom: 8px; font-size: 1rem; }
    .blog-content strong { color: var(--text-dark); font-weight: 600; }
    .blog-content a { color: var(--primary); text-decoration: underline; }
    .blog-content a:hover { opacity: 0.8; }
    .blog-content blockquote { border-left: 3px solid var(--primary); margin: 32px 0; padding: 16px 24px; background: rgba(26,158,138,0.06); border-radius: 0 8px 8px 0; }
    .blog-content blockquote p { margin: 0; color: var(--text-dark); font-style: italic; font-size: 1.05rem; }
    .blog-content hr { border: none; border-top: 1px solid rgba(26,158,138,0.2); margin: 40px 0; }
    .blog-back { display: inline-flex; align-items: center; gap: 8px; color: var(--primary); font-weight: 600; font-size: 0.9rem; text-decoration: none; margin-bottom: 40px; transition: opacity 0.2s; }
    .blog-back:hover { opacity: 0.75; }
    .blog-cta { margin-top: 64px; background: rgba(26,158,138,0.08); border: 1px solid rgba(26,158,138,0.25); border-radius: 12px; padding: 36px 40px; text-align: center; }
    .blog-cta h3 { font-size: 1.3rem; font-weight: 700; color: var(--text-dark); margin-bottom: 10px; }
    .blog-cta p { color: var(--text-medium); margin-bottom: 20px; font-size: 0.97rem; }
  </style>
</head>
<body>

${NAV}

  <section class="blog-hero">
    <div class="container">
      <div class="blog-meta">
        <span class="blog-tag">${post.tag || 'AI & Business'}</span>
        <span class="blog-date">${formatDate(post.date)}</span>
      </div>
      <h1 class="blog-title">${post.title}</h1>
      ${post.description ? `<p class="blog-description">${post.description}</p>` : ''}
    </div>
  </section>

  <section class="blog-body">
    <div class="container">
      <div class="blog-content">
        <a href="/blog/" class="blog-back">&#8592; All articles</a>
        ${post.html}
        <div class="blog-cta">
          <h3>Want help putting this into practice?</h3>
          <p>We work with SMEs across North East England, North Yorkshire and Cumbria. Book a free, no-obligation conversation.</p>
          <a href="/contact.html" class="btn btn-primary">Book a Free Chat &rarr;</a>
        </div>
      </div>
    </div>
  </section>

${FOOTER}

${PAGE_SCRIPT}
</body>
</html>`;
}

// ── Blog index template ───────────────────────────────────────────────────────
function renderBlogIndex(posts) {
  const cards = posts.length === 0
    ? `<p style="color:var(--text-medium);text-align:center;padding:48px 0;">No articles yet — check back soon.</p>`
    : posts.map((p, i) => `
        <article class="blog-index-card reveal${i > 0 ? ' reveal-delay-' + Math.min(i, 3) : ''}">
          <div class="bic-tag">${p.tag || 'AI & Business'}</div>
          <h2 class="bic-title"><a href="/blog/${p.slug}.html">${p.title}</a></h2>
          <p class="bic-desc">${p.description || ''}</p>
          <div class="bic-footer">
            <span class="bic-date">${formatDate(p.date)}</span>
            <a href="/blog/${p.slug}.html" class="bic-read">Read article &rarr;</a>
          </div>
        </article>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog | Orchestrate Digital</title>
  <meta name="description" content="Practical articles on AI, digital transformation and AI governance for SMEs across North East England.">
  <link rel="canonical" href="https://orchestratedigital.co.uk/blog/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css">
  <style>
    .blog-index-hero { background: linear-gradient(145deg,#060E0D,#0C1C19); padding: 88px 0 56px; border-bottom: 1px solid rgba(26,158,138,0.15); }
    .blog-index-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 28px; margin-top: 48px; }
    .blog-index-card { background: linear-gradient(145deg,rgba(26,158,138,0.1),rgba(26,158,138,0.04)); border: 1px solid rgba(26,158,138,0.25); border-top: 3px solid var(--primary); border-radius: 12px; padding: 32px 30px; display: flex; flex-direction: column; transition: transform 0.25s, box-shadow 0.25s; }
    .blog-index-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(26,158,138,0.18); }
    .bic-tag { font-size: 0.72rem; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase; color: var(--primary); margin-bottom: 14px; }
    .bic-title { font-size: 1.15rem; font-weight: 700; line-height: 1.35; margin-bottom: 12px; }
    .bic-title a { color: var(--text-dark); text-decoration: none; }
    .bic-title a:hover { color: var(--primary); }
    .bic-desc { font-size: 0.92rem; color: var(--text-medium); line-height: 1.7; flex: 1; margin-bottom: 20px; }
    .bic-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(26,158,138,0.15); padding-top: 16px; margin-top: auto; }
    .bic-date { font-size: 0.82rem; color: var(--text-light); }
    .bic-read { font-size: 0.88rem; font-weight: 600; color: var(--primary); text-decoration: none; }
    .bic-read:hover { opacity: 0.8; }
    @media (max-width: 640px) { .blog-index-grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>

${NAV}

  <section class="blog-index-hero">
    <div class="container">
      <div class="section-label">Insights &amp; Guides</div>
      <h1 style="font-size:clamp(2rem,5vw,3rem);font-weight:800;line-height:1.15;color:var(--text-dark);margin:12px 0 16px;">Practical AI guidance for <span class="gradient-text">North East businesses</span></h1>
      <p style="font-size:1.05rem;color:var(--text-medium);max-width:620px;line-height:1.7;">Plain-English articles on AI adoption, governance and digital transformation — written for business owners, not tech teams.</p>
    </div>
  </section>

  <section style="padding:72px 0 96px;">
    <div class="container">
      <div class="blog-index-grid">
        ${cards}
      </div>
    </div>
  </section>

${FOOTER}

${PAGE_SCRIPT}
</body>
</html>`;
}

// ── Main build ────────────────────────────────────────────────────────────────
fs.mkdirSync('_site', { recursive: true });
fs.mkdirSync('_site/blog', { recursive: true });

// Copy static site files
for (const file of SITE_FILES) {
  if (fs.existsSync(file)) fs.copyFileSync(file, `_site/${file}`);
}

// Copy admin panel
copyDir('admin', '_site/admin');

// Copy images if they exist
copyDir('images', '_site/images');

// Process markdown posts
const postsDir = 'posts';
const posts = [];

if (fs.existsSync(postsDir)) {
  const mdFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  for (const file of mdFiles) {
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
    const { data, content: body } = matter(raw);
    if (!data.title || !data.date) continue; // skip incomplete posts
    const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '');
    const html = marked.parse(body);
    const post = { ...data, slug, html };
    posts.push(post);
    fs.writeFileSync(`_site/blog/${slug}.html`, renderPost(post));
    console.log(`  ✓ /blog/${slug}.html`);
  }
}

// Sort newest first, write index
posts.sort((a, b) => new Date(b.date) - new Date(a.date));
fs.writeFileSync('_site/blog/index.html', renderBlogIndex(posts));

// ── Generate sitemap.xml ──────────────────────────────────────────────────────
const today = new Date().toISOString().split('T')[0];
const staticEntries = STATIC_PAGES.map(p => `
  <url>
    <loc>${BASE_URL}${p.path}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    <lastmod>${today}</lastmod>
  </url>`).join('');

const postEntries = posts.map(p => `
  <url>
    <loc>${BASE_URL}/blog/${p.slug}.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <lastmod>${new Date(p.date).toISOString().split('T')[0]}</lastmod>
  </url>`).join('');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${postEntries}
</urlset>`;

fs.writeFileSync('_site/sitemap.xml', sitemap);
console.log(`  ✓ sitemap.xml (${STATIC_PAGES.length + posts.length} URLs)`);

console.log(`\nBuild complete — ${posts.length} post(s) generated.`);
