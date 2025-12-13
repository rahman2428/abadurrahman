

document.addEventListener("DOMContentLoaded", () => {
  const postsList = document.getElementById("postsList");
  const searchInput = document.getElementById("searchInput");
  const exportBtn = document.getElementById("exportBtn");
  const postView = document.getElementById("postView");
  const listView = document.getElementById("listView");
  const postTitleHeading = document.getElementById("postTitleHeading");
  const postMeta = document.getElementById("postMeta");
  const postContent = document.getElementById("postContent");
  const backToList = document.getElementById("backToList");
  const yearEl = document.getElementById("year");

  yearEl && (yearEl.textContent = new Date().getFullYear());

  function readInitialPosts() {
    const el = document.getElementById("initialPosts");
    if (!el) return [];
    try {
      const data = JSON.parse(el.textContent || "[]");
      if (!Array.isArray(data)) return [];
      // normalize: ensure date
      data.forEach((p) => {
        if (!p.date) p.date = new Date().toISOString();
      });
      return data;
    } catch (err) {
      console.error("Failed to parse initialPosts JSON:", err);
      return [];
    }
  }

  // utilities
  function slugify(s) {
    return (s || "")
      .toString()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 80);
  }
  function escapeHtml(s) {
    const str = (s || "").toString();
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function getQueryParam(name) {
    const u = new URL(location.href);
    return u.searchParams.get(name);
  }

  // render list view
  function renderList(filter = "") {
    if (!postsList) return;
    const posts = readInitialPosts()
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    const q = (filter || "").toLowerCase().trim();
    if (posts.length === 0) {
      postsList.innerHTML =
        '<p style="color:var(--muted)">No posts — add posts in the HTML file inside &lt;script id="initialPosts"&gt;.</p>';
      return;
    }
    const shown = posts.filter((p) => {
      if (!q) return true;
      return (p.title + " " + (p.tags || "") + " " + (p.body || ""))
        .toLowerCase()
        .includes(q);
    });
    if (shown.length === 0) {
      postsList.innerHTML =
        '<p style="color:var(--muted)">No posts match your search.</p>';
      return;
    }
    postsList.innerHTML = shown
      .map((p) => {
        const excerpt = (p.body || "")
          .slice(0, 260)
          .replace(/\n+/g, " ")
          .trim();
        return `
        <article class="card post-card">
          <div style="flex:1">
            <a class="post-link" data-slug="${encodeURIComponent(
              p.slug
            )}" href="?post=${encodeURIComponent(
          p.slug
        )}" style="text-decoration:none;color:inherit">
              <h3 style="margin:0">${escapeHtml(p.title)}</h3>
            </a>
            <div class="post-meta">${p.tags ? escapeHtml(p.tags) : ""}</div>
            <p class="post-excerpt">${escapeHtml(excerpt)}${
          (p.body || "").length > 260 ? "…" : ""
        }</p>
          </div>
        </article>
      `;
      })
      .join("");
    // attach click handlers (prevent full navigation for smoothness)
    postsList.querySelectorAll("a.post-link").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const slug = decodeURIComponent(a.getAttribute("data-slug"));
        showPost(slug);
      });
    });
  }

  // show single post
  function showPost(slug) {
    const posts = readInitialPosts();
    const p = posts.find((x) => x.slug === slug || slugify(x.title) === slug);
    if (!p) {
      alert("Post not found");
      return;
    }
    listView.style.display = "none";
    postView.style.display = "block";
    postTitleHeading.textContent = p.title;
    postMeta.innerHTML = `${p.tags ? escapeHtml(p.tags) : ""}`;
    // render markdown or raw HTML if marked not available
    if (window.marked) {
      postContent.innerHTML = marked.parse(p.body || "");
    } else {
      // fallback: simple paragraph split
      postContent.innerHTML =
        "<div>" +
        (p.body || "")
          .split("\n\n")
          .map((s) => `<p>${escapeHtml(s)}</p>`)
          .join("") +
        "</div>";
    }
    history.replaceState(null, "", `?post=${encodeURIComponent(slug)}`);
  }

  backToList &&
    backToList.addEventListener("click", (e) => {
      e.preventDefault();
      history.replaceState(null, "", "blog.html");
      postView.style.display = "none";
      listView.style.display = "block";
      renderList(searchInput.value);
    });

  // wire search
  searchInput &&
    searchInput.addEventListener("input", (e) => renderList(e.target.value));

  // route on load (open ?post=slug if present)
  function routeOnLoad() {
    const slug = getQueryParam("post");
    if (slug) {
      showPost(decodeURIComponent(slug));
    } else {
      listView.style.display = "block";
      postView.style.display = "none";
      renderList("");
    }
  }

  // initial
  routeOnLoad();
});
