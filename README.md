# Dennis Apau — Personal reflections

A lightweight personal blog built with plain HTML, CSS and JavaScript. It has no framework, tracking, login, build step or paid dependency.

## Folder structure

```text
dennis-apau-blog/
├── index.html
├── post.html
├── about.html
├── contact.html
├── posts.json
├── README.md
└── assets/
    ├── styles.css
    ├── site.js
    └── theme.js
```

## 1. Preview on your computer

Do not open `index.html` by double-clicking it: browsers commonly block the `fetch()` request used to load `posts.json` from a `file://` address.

1. Install Python 3 if it is not already installed.
2. Open Terminal (Mac) or Command Prompt / PowerShell (Windows).
3. Change directory to this folder. For example: `cd Downloads/dennis-apau-blog`
4. Run: `python -m http.server 8000` (on some Windows installations use `py -m http.server 8000`).
5. Open `http://localhost:8000` in your browser.
6. To stop the local server, return to the terminal and press `Ctrl+C`.

## 2. Publish for free with GitHub Pages

1. Create a free account at https://github.com/ if you do not already have one.
2. Create a new **public** repository. A good name is `dennis-apau-blog`.
3. On your computer, upload the contents of this folder to the repository (upload the files and the `assets` folder, not the outer folder itself). Commit the changes.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**. Select `main` and `/ (root)`, then save.
6. Wait a few minutes. GitHub will show your published address, usually `https://YOUR-USERNAME.github.io/dennis-apau-blog/`.

If you name the repository `YOUR-USERNAME.github.io`, GitHub uses `https://YOUR-USERNAME.github.io/` instead.

## 3. Connect a custom domain

You need to own the domain already; the domain registrar may charge its normal renewal fee. GitHub Pages hosting is free.

1. In your repository, go to **Settings → Pages → Custom domain**.
2. Enter the domain you own, such as `www.example.com`, and save.
3. At your domain registrar, open its DNS settings and add the record GitHub requests. For a `www` subdomain, this is usually a `CNAME` pointing to `YOUR-USERNAME.github.io` (replace this with your actual GitHub username and do not include the repository name).
4. For an apex/root domain such as `example.com`, GitHub Pages commonly uses four `A` records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`. Check GitHub's current documentation before changing DNS: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
5. DNS changes can take up to 24–48 hours to become visible. Once GitHub verifies the domain, enable **Enforce HTTPS** in Settings → Pages.
6. Keep the `CNAME` file GitHub adds to your repository. If you publish from the root of the repository, it should remain alongside `index.html`.

Do not delete existing email-related DNS records (such as MX records) when adding website records.

## 4. Add a new blog post

All posts live in one file: `posts.json`. You do not need to create a separate page for each article.

1. Open `posts.json` in a plain text editor (Notepad, TextEdit in plain-text mode, or VS Code).
2. Copy one complete post object, from its opening `{` to its closing `}`.
3. Paste it into the array, adding a comma between the previous post and the new one.
4. Change the `slug` to a unique URL-friendly version of the title (lowercase words separated by hyphens, no spaces).
5. Change `title`, `date` (`YYYY-MM-DD`), and `excerpt`.
6. Replace `body` with your writing in Markdown. Use `\\n\\n` between paragraphs because the content is stored as JSON.

### Markdown supported

- `# Heading` for a main heading
- `## Heading` for a section heading
- `### Heading` for a smaller heading
- A blank line between paragraphs
- `- List item` for bullet lists
- `1. List item` for numbered lists
- `> A quotation` for a blockquote
- `**bold**`, `*italic*`, and `[link text](https://example.com)` for inline formatting

Example post object (remember to put a comma after it if another post follows):

```json
{
  "slug": "a-new-thought",
  "title": "A New Thought",
  "date": "2026-12-01",
  "excerpt": "A short sentence that invites someone to read the post.",
  "body": "# A New Thought\\n\\nWrite your opening paragraph here.\\n\\n## Another thought\\n\\nContinue writing here."
}
```

7. Save the file and preview the site again. The home page automatically sorts posts newest first.
8. Upload the updated `posts.json` to GitHub and commit the change. GitHub Pages republishes the site automatically.

## Personalise before publishing

- In `contact.html`, replace `hello@example.com` in both the visible text and the `mailto:` link with your email address.
- In `about.html`, replace the initials/photo placeholder with your own photo when ready.
- In each HTML file, replace `https://example.com/` in the canonical link in `index.html` with your actual website address once you have one.
- Update the sample posts in `posts.json` with your own writing, or keep them as examples.
- Change the sample bio in `about.html` so it accurately describes you.

## Notes

- The theme toggle remembers the visitor's choice in that browser using local storage. The site itself does not use cookies, analytics or tracking.
- Reading time is estimated at 220 words per minute.
- This is a static site. It does not have a login or online editing dashboard. To publish a post, edit `posts.json` and upload the change to GitHub. You can do that through GitHub's website without installing developer tools.
- Because there is no Markdown library, the built-in Markdown renderer intentionally supports the basic formatting listed above.
