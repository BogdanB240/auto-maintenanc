# 🚗 Auto Maintenance - Ghid Setup Complet

Ghid pas cu pas pentru a pune aplicația ta în producție.

## Pasul 1: Creează un Repository pe GitHub

1. Mergi pe [github.com](https://github.com) și loghează-te
2. Click pe icon-ul "+" din dreapta sus → **New repository**
3. Numește-l `auto-maintenance`
4. Selectează "Private" (optional)
5. Click **Create repository**

## Pasul 2: Push codul pe GitHub

În terminalul tău (în folderul `auto-maintenance`):

```bash
git remote add origin https://github.com/YOUR_USERNAME/auto-maintenance.git
git branch -M main
git push -u origin main
```

## Pasul 3: Setup Supabase

### 3.1 Creează Proiectul

1. Mergi pe [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Loghează-te cu GitHub sau email
4. Click "New Project" → selectează organizația
5. Completează:
   - **Name**: `auto-maintenance` (sau altceva)
   - **Database Password**: salvează undeva sigur!
   - **Region**: `Bucharest` sau cea mai apropiată
6. Click "Create new project" (așteptă 2-3 minute)

### 3.2 Setup Database

1. Pe pagina proiectului, mergi la **SQL Editor** (stânga)
2. Click "New Query"
3. Copiază **tot** conținutul din `SQL_SETUP.sql` din repo
4. Paste-ul în query-ul din Supabase
5. Click "Run" (butonul negru)
6. ✅ Gata! Tabelele sunt create

### 3.3 Obține Cheile API

1. În Supabase, mergi la **Project Settings** (stânga jos, engrenajul)
2. Click pe "API"
3. Copiază și salvează:
   - `URL` (de la "Project URL")
   - `anon` key (de la "API keys")

Exemplu:
```
URL: https://randomstring.supabase.co
ANON KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.4 Setup Google Login (Optional)

Dacă vrei login cu Google (recomandat):

1. Mergi pe [console.cloud.google.com](https://console.cloud.google.com)
2. Click "Create Project" (sus, lângă Google Cloud)
3. Numește-l `auto-maintenance`
4. Click "Create"
5. Așteptă să se creeze
6. Mergi la **APIs & Services** → **OAuth Consent Screen**
7. Click "Create"
8. Selectează "External" → "Create"
9. Completează:
   - **App name**: Auto Maintenance
   - **User support email**: email-ul tău
   - **Developer contact**: email-ul tău
10. Click "Save and Continue" (skip scope-urile)
11. Mergi la **Credentials** (stânga)
12. Click "Create Credentials" → "OAuth client ID"
13. Selectează "Web application"
14. Adaugă la **Authorized redirect URIs**:
    ```
    https://your-project.supabase.co/auth/v1/callback
    ```
    (înlocuiește `your-project` cu ceva de la URL-ul tău Supabase)
15. Click "Create"
16. Copiază **Client ID** și **Client Secret**

Back in Supabase:
1. **Authentication** → **Providers** (stânga)
2. Click "Google"
3. Enable toggle
4. Paste Client ID și Secret
5. Click "Save"

## Pasul 4: Setup Local (Testare pe computerul tău)

```bash
# Instalează dependencies
npm install

# Creează .env.local cu valorile tale
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://randomstring.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Ruleaza app-ul:
```bash
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000) și testează!

## Pasul 5: Deploy pe Vercel

### 5.1 Conectează GitHub la Vercel

1. Mergi pe [vercel.com](https://vercel.com)
2. Click "Sign Up" → "Continue with GitHub"
3. Autorizează Vercel
4. Alege "Create Team" (skip-uiți sau creezi una)
5. Click "Continue with GitHub"

### 5.2 Import Repository

1. Click "Add New..." → "Project"
2. Click "Import Git Repository"
3. Paste URL-ul tău:
   ```
   https://github.com/YOUR_USERNAME/auto-maintenance.git
   ```
4. Click "Continue"
5. Click "Continue" (skip team selection)

### 5.3 Adaugă Environment Variables

1. Sub "Environment Variables", adaugă:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://randomstring.supabase.co`
   - Click "Add"

2. Adaugă din nou:
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Click "Add"

3. Click "Deploy"

Așteptă 2-3 minute... ✅ Gata!

Vercel îți dă un link:
```
https://auto-maintenance-tau.vercel.app
```

## Pasul 6: Configurează Vercel Domain (Optional)

Dacă vrei domeniu custom:

1. Pe Vercel, mergi la proiectul tău
2. Click "Settings" → "Domains"
3. Adaugă domeniu

Sau asteapta mai tarziu.

## Pasul 7: Testează Aplicația în Producție

1. Deschide link-ul de pe Vercel
2. Click "Sign in with Google" (daca ai setup-at)
3. Completeaza formular + adauga un service
4. Verifica timeline
5. Cuta ceva
6. Verifica stats

## Troubleshooting

### "Database error" pe Vercel

1. Verifica ca env vars-urile sunt corecte în Vercel
2. Verifica că SQL setup-ul s-a rulat în Supabase
3. În Supabase, mergi la **Authentication** → **Policies** și asigură-te că sunt enabling

### Google login nu merge

1. Verifica că Google OAuth keys sunt corecte în Supabase
2. Verifica că redirect URL din Google Cloud include `supabase.co`
3. Check console errors în browser (F12)

### Styles not loading pe Vercel

Rebuild-ul:
1. Pe Vercel, mergi la "Deployments"
2. Click pe ultima deployment
3. Click "Redeploy"

### "Unauthorized" error

1. Verifica că RLS policies sunt activate în Supabase
2. Verifica că esti logged in
3. Deschide DevTools → Network → verifica response

## Sfaturi pentru Utilizare Ulterioară

### Deploy changes

```bash
git add .
git commit -m "Description"
git push origin main
```

Vercel se va rebuilda automat.

### Modifica tabela

1. În Supabase, SQL Editor
2. Faci query-urile necesare
3. App se sincronizeaza automat

### Backup data

```sql
-- În Supabase SQL Editor
SELECT * FROM maintenance_logs;
-- Exporta ca CSV
```

### Scalare

Când ai mult traffic:
1. Supabase scalează automat
2. Vercel scalează automat
3. Nici ceva de facut de tine

## Next Steps

Acum poti:

- ✅ Adauga servicii zilnic
- ✅ Cauta piesele schimbate
- ✅ Vede timeline pe ani/luni
- ✅ Exporta stats

Viitor:
- [ ] Adaugă icon PWA pe home screen
- [ ] Invite prietenii (schimbă RLS)
- [ ] Adaugă mai multe masini
- [ ] Integreaza cu calendar pentru reminder-uri

## Urgent: Keep Your Credentials Safe!

🔐 **NU-ți posta credentialele publice!**

Daca le postezi public:
1. Mergi în Supabase Settings → API
2. Click "Rotate Key" pe anon key
3. Update `.env.local` si Vercel env vars

---

**Dacă apare vreun error, google-ul e prietenul tău.** ✌️

Succes! 🚀
