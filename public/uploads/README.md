# Portfolio Media Uploads (`public/uploads/`)

Upload your photos and custom video thumbnails into these folders using GitHub's web interface (**Add file → Upload files**):

- `public/uploads/thumbnails/` → Custom video thumbnails (referenced in `src/data/content.json` as `"/uploads/thumbnails/your-file.jpg"`)
- `public/uploads/photos/achievements/` → Photos for **My Achievements** (`"/uploads/photos/achievements/your-file.jpg"`)
- `public/uploads/photos/seminars/` → Photos for **Different Seminars** (`"/uploads/photos/seminars/your-file.jpg"`)
- `public/uploads/photos/tours/` → Photos for **Tours & Expeditions** (`"/uploads/photos/tours/your-file.jpg"`)
- `public/uploads/photos/personal/` → Photos for **Personal Photos** (`"/uploads/photos/personal/your-file.jpg"`)

> **Important:** Because Vite serves everything inside `public/` at the root URL `/`, always omit `public` when writing paths in `src/data/content.json` (write `"/uploads/photos/achievements/award.jpg"`, **not** `"/public/uploads/..."`).
