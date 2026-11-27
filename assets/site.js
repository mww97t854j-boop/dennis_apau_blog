const POSTS_FILE = 'posts.json';

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function formatDate(dateString) {
  const date = new Date(dateString + 'T12:00:00');
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}
function readingTime(markdown) {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}
// A small Markdown renderer for headings, paragraphs, lists, blockquotes, bold, italic and links.
function inlineMarkdown(text) {
  let safe = escapeHTML(text);
  safe = safe.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>');
  safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');
  safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  safe = safe.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return safe;
}
function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r/g, '').split('\n');
  const out = [];
  let paragraph = [], listType = null, quote = [];
  const flushParagraph = () => { if (paragraph.length) { out.push('<p>' + inlineMarkdown(paragraph.join(' ')) + '</p>'); paragraph = []; } };
  const flushList = () => { if (listType) { out.push(`<${listType}>` + listItems.join('') + `</${listType}>`); listType = null; listItems = []; } };
  let listItems = [];
  const flushQuote = () => { if (quote.length) { out.push('<blockquote>' + inlineMarkdown(quote.join(' ')) + '</blockquote>'); quote = []; } };
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) { flushParagraph(); flushList(); flushQuote(); continue; }
    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    const bullet = trimmed.match(/^[-*]\s+(.+)$/);
    const numbered = trimmed.match(/^\d+\.\s+(.+)$/);
    if (heading) { flushParagraph(); flushList(); flushQuote(); const level = heading[1].length; out.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`); }
    else if (trimmed.startsWith('> ')) { flushParagraph(); flushList(); quote.push(trimmed.slice(2)); }
    else if (bullet || numbered) { flushParagraph(); flushQuote(); const type = bullet ? 'ul' : 'ol'; if (listType && listType !== type) flushList(); listType = type; listItems.push('<li>' + inlineMarkdown((bullet || numbered)[1]) + '</li>'); }
    else { flushList(); flushQuote(); paragraph.push(trimmed); }
  }
  flushParagraph(); flushList(); flushQuote();
  return out.join('\n');
}
async function getPosts() {
  const response = await fetch(POSTS_FILE);
  if (!response.ok) throw new Error('Could not load posts.json');
  const posts = await response.json();
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}
function setPageMeta(title, description) {
  document.title = title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = description;
}
document.addEventListener('DOMContentLoaded', async () => {
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  const list = document.getElementById('post-list');
  const article = document.getElementById('article');
  try {
    const posts = await getPosts();
    if (list) {
      list.innerHTML = posts.map(post => `
        <article class="post-row">
          <time class="post-date" datetime="${escapeHTML(post.date)}">${formatDate(post.date)}</time>
          <div><h3><a href="post.html?slug=${encodeURIComponent(post.slug)}">${escapeHTML(post.title)}</a></h3>
          <p>${escapeHTML(post.excerpt)}</p></div>
        </article>`).join('') || '<p class="muted">No posts yet. Add your first one to posts.json.</p>';
    }
    if (article) {
      const slug = new URLSearchParams(window.location.search).get('slug');
      const post = posts.find(item => item.slug === slug);
      if (!post) {
        article.innerHTML = '<div class="error-message"><h1>Post not found</h1><p>This article may have moved or the link may be incorrect.</p><a class="text-link" href="index.html">Return to the home page</a></div>';
      } else {
        const minutes = readingTime(post.body);
        setPageMeta(`${post.title} — Dennis Apau`, post.excerpt);
        article.innerHTML = `
          <header class="article-header">
            <p class="eyebrow">Personal reflections</p>
            <h1>${escapeHTML(post.title)}</h1>
            <div class="article-meta"><time datetime="${escapeHTML(post.date)}">${formatDate(post.date)}</time> · ${minutes} min read</div>
            <p class="article-excerpt">${escapeHTML(post.excerpt)}</p>
          </header>
          <div class="article-body">${renderMarkdown(post.body)}</div>`;
      }
    }
  } catch (error) {
    const message = '<p class="error-message">Posts could not be loaded. Check that <code>posts.json</code> is in the website folder and that you are previewing the site using a local web server.</p>';
    if (list) list.innerHTML = message;
    if (article) article.innerHTML = message;
  }
});
