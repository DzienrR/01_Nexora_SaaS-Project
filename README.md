# Nexora website

Nexora is a static website with one HTML entry point. All seven page views
are contained in `index.html`; the shared styles, navigation behavior, and
page interactions remain in `css/style.css` and `js/main.js`.

## Page routes

Open a page directly with one of these hash routes:

- `index.html#home`
- `index.html#features`
- `index.html#dashboard`
- `index.html#pricing`
- `index.html#about`
- `index.html#resources`
- `index.html#contact`

Navigation switches views without loading another HTML file. The route works
with direct links and browser Back/Forward navigation.

## Run locally

From the repository root, start Python's built-in static file server:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000/> in a browser. No package manager, build
step, or external service is required.

GitHub Pages can serve the site directly from the repository root.

The contact and newsletter forms validate input and show preview feedback in
the browser. They do not send messages or subscriptions to a backend.
