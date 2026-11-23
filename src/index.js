// Password lock for yashmodis.com.
// Only a one-way hash of the password is stored here, never the password itself.
// To change the password, ask Claude to generate a new PASS_HASH.
const PASS_HASH = "c1e4b1f6256bc005bc2a5357c60fa0c23b5445bd77218596eecba5dcbb36390f";
const SALT = "|yashmodis-v1";
const COOKIE = "ym_auth";
const MAX_AGE = 60 * 60 * 24 * 30; // stay signed in for 30 days

async function sha256(s) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, "0")).join("");
}
function getCookie(req, name) {
  const m = (req.headers.get("Cookie") || "").match(new RegExp("(?:^|;\\s*)" + name + "=([a-f0-9]{64})"));
  return m ? m[1] : "";
}
function page(msg, status = 401) {
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Yash Modi #38 · Private</title>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@500;600;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;font:16px/1.5 Barlow,system-ui,sans-serif;color:#10275f;
background:linear-gradient(rgba(255,255,255,.88),rgba(255,255,255,.95)),repeating-linear-gradient(90deg,#fff 0 90px,#f3f6fb 90px 180px)}
.card{width:min(380px,92vw);background:#fff;border:1px solid #e3e8f0;border-radius:22px;padding:32px 28px;box-shadow:0 18px 40px rgba(16,39,95,.12);text-align:center}
.num{font-family:Anton,Impact,sans-serif;font-size:72px;line-height:.9}h1{font-family:Anton,Impact,sans-serif;font-weight:400;font-size:36px;margin:6px 0 4px}
p{margin:0 0 20px;color:#596275}input{width:100%;font:16px Barlow,sans-serif;padding:12px 14px;border:1px solid #cfd6e2;border-radius:12px;min-height:48px}
input:focus{outline:3px solid #1d4fd6;outline-offset:1px}button{margin-top:12px;width:100%;min-height:48px;border:0;border-radius:999px;background:#10275f;color:#fff;font:700 16px Barlow,sans-serif;cursor:pointer}
.err{color:#b42318;font-weight:600;margin:12px 0 0}</style></head><body><form class="card" method="post" action="/__login">
<div class="num">38</div><h1>Yash Modi</h1><p>This is a private family website.<br>Please enter the password.</p>
<input type="password" name="password" placeholder="Password" autocomplete="current-password" autofocus required>
<button type="submit">Enter</button>${msg ? `<p class="err">${msg}</p>` : ""}</form></body></html>`;
  return new Response(html, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === "/__logout") {
      return new Response(null, { status: 302, headers: { Location: "/", "Set-Cookie": `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` } });
    }
    if (url.pathname === "/__login") {
      if (req.method !== "POST") return page("");
      const form = await req.formData().catch(() => null);
      const pw = String(form?.get("password") || "");
      const token = await sha256(pw + SALT);
      if ((await sha256(token)) !== PASS_HASH) return page("Wrong password, please try again.");
      return new Response(null, { status: 303, headers: { Location: "/", "Cache-Control": "no-store",
        "Set-Cookie": `${COOKIE}=${token}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax` } });
    }
    const token = getCookie(req, COOKIE);
    if (!token || (await sha256(token)) !== PASS_HASH) return page("");
    const res = await env.ASSETS.fetch(req);
    const out = new Response(res.body, res);
    out.headers.set("X-Robots-Tag", "noindex, nofollow");
    out.headers.set("Cache-Control", "private, no-cache");
    return out;
  }
};
