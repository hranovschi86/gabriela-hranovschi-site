# gabrielahranovschi.com — prototip vizual

Site static cu meniu complet, construit pe brand guidelines din [`../brand/`](../brand/).

Acest repo e **prototip vizual + specificație** pentru migrarea WordPress descrisă în `materials/inbox/Plan_Scrum_gabrielahranovschi.docx`. Nu include plăți, LMS, comunitate funcțională sau email automation — doar UI.

## Rulare locală

```bash
cd site
python3 -m http.server 8000
```

Deschide [http://localhost:8000/](http://localhost:8000/) în browser.

> **De ce un server și nu open file?** Header și footer sunt injectate prin `fetch()` din `/partials/`. Browser-ele blochează fetch-urile din `file://` din motive de securitate.

## Structură

```
site/
├── index.html              Home
├── despre.html             Despre Gabriela
├── comunitate.html         Comunitate #suntaici
├── newsletter.html         Lead magnet + înscriere
├── media.html              Apariții TV / podcast / articole
├── contact.html
├── faq.html
├── termeni.html · privacy.html · cookies.html · 404.html
├── cursuri/
│   ├── index.html          Hub cursuri
│   └── [slug].html         Pagini de vânzare per curs
├── blog/
│   ├── index.html          Hub articole
│   └── [slug].html         Articol
├── assets/
│   ├── css/
│   │   ├── tokens.css      Variabile de brand (culori, fonturi, spațieri)
│   │   ├── base.css        Reset + tipografie + layout primitives
│   │   └── components.css  Header, footer, butoane, carduri, formulare
│   ├── js/
│   │   ├── partials.js     Injectează header/footer + marchează linkul activ
│   │   └── ui.js           Acordeon FAQ + a11y dropdown
│   ├── img/                Fotografii (placeholder momentan)
│   └── logo/               5 variante SVG (copiate din brand/logo/)
└── partials/
    ├── header.html         Nav complet
    └── footer.html         Linkuri + social + juridice
```

## Brand tokens — referință rapidă

| Token | Valoare | Rol |
|-------|---------|-----|
| `--cream` | `#F4EBDD` | Fundal (60%) |
| `--sage` | `#8A9A7B` | Secundar (20%) |
| `--terracotta` | `#C4634A` | Accent (10%) |
| `--rose` | `#D9A89A` | Soft (5%) |
| `--cocoa` | `#3D2E2A` | Text (5%) |

Fonturi: **Fraunces** (titluri) + **Nunito Sans** (corp), Google Fonts cu `display=swap`.

Detalii complete: [`../brand/brand-guidelines.md`](../brand/brand-guidelines.md).

## Backup pe GitHub (manual)

Repo: `git@github.com:hranovschi86/gabriela-hranovschi-site.git` *(de creat la primul backup)*

```bash
git status                          # ce s-a schimbat
git add .
git commit -m "feat: <descriere>"
git push
```

Backup-ul rulează **doar la cerere** — îi spui asistentului „fă backup" și el rulează comenzile.

## Convenții

- **HTML semantic** (`<main>`, `<section>`, `<nav>`, `<article>`)
- **Mobile-first**: breakpoint principal 600px, 900px, 1100px
- **Accesibilitate**: WCAG AA, `aria-current="page"`, skip link, contrast verificat
- **Performanță**: zero dependențe build, fonturi preconnect, lazy loading imagini
- **Voce**: caldă, calmă, prezentă — vezi [brand-guidelines.md secțiunea Voce](../brand/brand-guidelines.md)

## Ce urmează

Pagini de construit (vezi planul în `~/.claude/plans/folosind-brand-guidelines-as-sleepy-quail.md`):

- [x] Fundație (CSS, partials, README)
- [ ] Home + Despre + Cursuri hub + Newsletter
- [ ] Comunitate + Media + Blog + Contact + FAQ
- [ ] Pagini juridice + sub-pagini cursuri suplimentare + polish
