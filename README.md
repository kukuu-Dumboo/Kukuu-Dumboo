<<<<<<< HEAD
## Hi there 👋

<!--
**kukuu-Dumboo/Kukuu-Dumboo** is a ✨ _special_ ✨ repository because its `README.md` (this file) appears on your GitHub profile.

Here are some ideas to get you started:

- 🔭 I’m currently working on ...
- 🌱 I’m currently learning ...
- 👯 I’m looking to collaborate on ...
- 🤔 I’m looking for help with ...
- 💬 Ask me about ...
- 📫 How to reach me: ...
- 😄 Pronouns: ...
- ⚡ Fun fact: ...
-->
=======
# OUR ARCHIVE

A static, dependency-free private archive. Files: `index.html`, `style.css`, `script.js`, `content-manifest.js`.

## Run
Open the folder in VS Code, install the **Live Server** extension, right-click `index.html` → *Open with Live Server*. (Opening the file directly won't load .txt files; use a server.)

## Edit
Everything personal lives in `content-manifest.js`: names (`SETTINGS.person2`), `relationshipStart`, the secret message and archive note. Dates are `YYYY-MM-DD`. Rows/sections with no data are hidden automatically; nothing is invented.

## Add content
- **Pics:** put `1.jpg, 2.jpg, ...` in `pics/Him`, `pics/Her`, `pics/Together`; set `count` for each in `CONTENT.pics`. Keep names exact.
- **Blogs:** `Blogs/<year>/Blog <n>/1.txt, 2.txt... 1.jpg...`; add the year/blog to `CONTENT.blogs` with `folder`, `textCount`, `imageCount`.
- **Dates:** `Dates/<Name>/1.txt, 1.jpg...`; add to `CONTENT.dates` (`folder: "Dates/Name"`).
- **Trips:** `Trips/<Name>/...`; add to `CONTENT.trips` (optional `stops` names the route points).
- **Letters / Little Things / extra timeline milestones:** add objects to `letters`, `little`, `timeline`.
- **Cross references:** `related: ["date:Proposal", "pics:Together"]` on any blog/date/trip.
- **TXT format:** blank line = new paragraph; `# Heading`; `---` separator. Text is never rendered as HTML.
- **Secret room:** go to `#/secret` (edit `SETTINGS.secret`). Ways in: type "secret", triple-click the title, or tap the revision number five times on the History page.

## Publish to GitHub Pages
Push the folder to a repository → Settings → Pages → deploy from `main` / root. Note: a public repo exposes your photos and text; use a private repo with Pages if your plan allows.
>>>>>>> ca60b59 (Build Our Archive website)
