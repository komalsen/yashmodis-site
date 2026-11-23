# yashmodis.com

Soccer website for **Yash Modi, #38**. Made with love by his mom.

The site is one page (`index.html`) that reads everything from the `data/` folder.
To update the site, edit a data file (or add a photo) and push to `main`.
Cloudflare Pages republishes automatically in a minute or two.

## Folders

| Path | What it holds |
|---|---|
| `index.html` | The whole website (design and code). Rarely needs changing. |
| `data/profile.json` | Name, number, position, team, about text, main photo, theme, links, live stream link |
| `data/matches.json` | Match results |
| `data/tournaments.json` | Tournaments and their results |
| `data/photos.json` | Photo list (albums + Best moments) |
| `data/albums.json` | Optional album descriptions/covers |
| `data/videos.json` | Videos (YouTube links or files in `videos/`) |
| `data/journal.json` | Mom's Journal posts |
| `data/awards.json` | Awards and milestones |
| `photos/` | Photo files (resize to about 1600px wide, JPG, before adding) |
| `videos/` | Short video clips only (under 25 MB). Longer videos go on YouTube. |

Dates are always `YYYY-MM-DD`. Lists are sorted newest-first by the site, so order in the file doesn't matter.

## Formats

**matches.json**
```json
[
  {
    "date": "2026-11-15",
    "opponent": "Lions FC",
    "competition": "Fall League",
    "team": "U12 Premier",
    "home": true,
    "us": 3,
    "them": 1,
    "goals": 2,
    "assists": 1,
    "notes": "Header goal in the 70th minute"
  }
]
```
`us` / `them` are the final score. Leave them as `""` for an upcoming game (shows "TBD").
Win/draw/loss and all of Yash's totals are calculated automatically from this file,
plus `previousStats` in `profile.json` for games played before the site existed.

**tournaments.json**
```json
[{ "name": "Spring Classic Cup", "date": "2026-04-12", "location": "San Jose, CA", "team": "U12 Premier", "result": "Champions", "goals": 4, "notes": "" }]
```
`result` examples: `Champions`, `Runner-up`, `Third place`, `Semi-finals`, `Quarter-finals`, `Group stage`.
Any result containing "Champion" counts as a title.

**photos.json**
```json
[{ "src": "photos/2026-11-15-vs-lions-fc/01.jpg", "caption": "Header goal", "date": "2026-11-15", "album": "vs Lions FC – Nov 15, 2026", "featured": true, "cover": true }]
```
- Each match/tournament is one **album** (folder `photos/<date>-<slug>/`). Albums are built from the `album` field.
- `featured: true` puts the photo in **Best moments** on the Home page (first 9 featured, first one shown large).
- `cover: true` makes it the album's cover (otherwise first featured, otherwise first photo).
- If an album name matches a tournament `name`, that tournament gets a "See photos" button.
- Hero photo on the Home page / About page is `profile.json` → `"photo"` (e.g. `photos/profile/main.jpg`).
- Resize to max 1600px, JPG quality ~82, strip location (EXIF/GPS) data.

**albums.json** (optional extra info per album)
```json
[{ "name": "vs Lions FC – Nov 15, 2026", "date": "2026-11-15", "description": "Won 3–1", "cover": "photos/2026-11-15-vs-lions-fc/03.jpg" }]
```

**videos.json**
```json
[{ "title": "Hat-trick vs Lions", "date": "2026-11-15", "playlist": "U12 Premier", "youtube": "https://youtu.be/XXXXXXXXXXX" }]
```
Use `"file": "videos/clip.mp4"` instead of `youtube` for a short clip stored in the repo.
`playlist` groups videos into team playlists.

**journal.json**
```json
[{ "title": "Our first tournament trip", "date": "2026-04-13", "category": "Travel", "body": "Text…", "photo": "photos/trip.jpg" }]
```
Categories: `Highlights`, `Travel`, `Achievements`, `Classics`, `Life`.

**awards.json**
```json
[{ "title": "Golden Boot — Spring Classic Cup", "date": "2026-04-12", "notes": "Top scorer with 4 goals" }]
```

## Theme

`profile.json` → `"theme"`: one of `midnight`, `royal`, `redblack`, `sky`, `purple`, `classic`,
or a custom object: `{ "p": "#hero", "p2": "#nav/footer", "k": "#jersey/accent", "kt": "#text on accent" }`.

## Privacy

This is a public site about a child. Don't add his school, home address, or the times and places of upcoming games.
