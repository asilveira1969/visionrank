# VisionRank | High-End Curation Platform

This project is now ready for **VS Code**.

## 1. Local Setup
1. Download these files to a folder on your computer.
2. Open the folder in **VS Code**.
3. Open the Terminal (**Ctrl + `**) and run:
   ```bash
   npm install
   ```

## 2. Environment Variables (Required)
Create a `.env` file in the project root and add:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Running the Site
To see the site live on your computer, run:
```bash
npm run dev
```
Click the link it gives you (usually `http://localhost:5173`).

## 4. Production Build
```bash
npm run build
```

## 5. Connecting to your GitHub
Run these commands one by one in the VS Code terminal:
```bash
git init
git remote add origin https://github.com/asilveira1969/visionrank.git
git add .
git commit -m "First upload from local VS Code"
git push -u origin main
```
