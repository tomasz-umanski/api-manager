# Instrukcja konfiguracji — API Manager

Kod integracji (Firebase, GA4, Hotjar, deploy) jest już w repozytorium. Aby projekt działał **produkcyjnie i spełniał wymagania checklisty**, trzeba ręcznie skonfigurować usługi zewnętrzne i uzupełnić zmienne środowiskowe.

## Co jest już zrobione w kodzie

| Element | Status w repozytorium |
|---------|----------------------|
| Firebase Auth (`signIn`, `signOut`, rejestracja) | ✅ `src/lib/firebase.ts`, `src/services/authService.ts` |
| Chronione trasy | ✅ `src/components/layout/ProtectedRoute.tsx` |
| Google Analytics 4 | ✅ `src/App.tsx` + `src/components/AnalyticsListener.tsx` |
| Hotjar | ✅ `src/App.tsx` |
| Deploy Railway | ✅ `railway.json`, `npm run start` |
| Szablon zmiennych | ✅ `.env.example` |

## Co pozostaje do zrobienia (ręcznie)

1. Utworzyć projekt **Firebase** i włączyć logowanie Email/Password.
2. Utworzyć strumień danych **Google Analytics 4** i skopiować Measurement ID.
3. Utworzyć witrynę **Hotjar** i skopiować Site ID.
4. Utworzyć plik `.env` lokalnie i ustawić te same zmienne na **Railway**.
5. Wdrożyć aplikację i dodać domenę produkcyjną w Firebase.
6. Zweryfikować działanie i zrobić **prawdziwe screeny** z paneli GA/Hotjar do README.

---

## Krok 0 — Przygotowanie lokalne

```bash
npm install
cp .env.example .env
```

Plik `.env` **nie commituj** do repozytorium (jest w `.gitignore`).

> **Uwaga:** Bez `VITE_FIREBASE_API_KEY` aplikacja uruchamia tryb deweloperski z mockowym logowaniem (dowolny email/hasło). Do oddania laboratorium i produkcji **musisz** skonfigurować prawdziwe Firebase.

---

## Krok 1 — Firebase Authentication

### 1.1 Utwórz projekt

1. Wejdź na [Firebase Console](https://console.firebase.google.com/).
2. Kliknij **Add project** / **Dodaj projekt**.
3. Podaj nazwę (np. `api-manager`) i dokończ kreator.

### 1.2 Dodaj aplikację webową

1. W projekcie kliknij ikonę **Web** (`</>`).
2. Zarejestruj aplikację (np. `api-manager-web`).
3. Skopiuj obiekt `firebaseConfig` — potrzebujesz tych wartości:

| Firebase Console | Zmienna w `.env` |
|------------------|------------------|
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |

### 1.3 Włącz logowanie Email/Password

1. **Build → Authentication → Get started**
2. Zakładka **Sign-in method**
3. Włącz **Email/Password** (pierwsza opcja, bez linków emailowych).

### 1.4 Utwórz użytkownika testowego

Opcja A — w konsoli:

1. **Authentication → Users → Add user**
2. Podaj email i hasło (min. 6 znaków).

Opcja B — w aplikacji:

1. Uruchom `npm run dev`
2. Na `/login` użyj przycisku **Register new account**

### 1.5 Autoryzowane domeny (ważne po deployu)

1. **Authentication → Settings → Authorized domains**
2. Domyślnie jest `localhost` — zostaw.
3. **Po deployu na Railway** dodaj domenę produkcyjną, np.:
   - `twoja-aplikacja.up.railway.app`

Bez tego logowanie na wdrożonej aplikacji zwróci błąd `auth/unauthorized-domain`.

### 1.6 Weryfikacja lokalna

```bash
npm run dev
```

1. Otwórz `http://localhost:5173/login`
2. Zaloguj się kontem z Firebase
3. Sprawdź przekierowanie na dashboard i działanie **Logout**

---

## Krok 2 — Google Analytics 4

### 2.1 Utwórz konto i właściwość

1. Wejdź na [Google Analytics](https://analytics.google.com/).
2. **Admin (koło zębate) → Create → Property**
3. Utwórz właściwość (np. `API Manager`).

### 2.2 Utwórz strumień danych Web

1. **Admin → Data streams → Add stream → Web**
2. Podaj URL:
   - lokalnie: `http://localhost:5173`
   - po deployu: dodaj drugi strumień lub zaktualizuj URL na domenę Railway
3. Skopiuj **Measurement ID** w formacie `G-XXXXXXXXXX`

### 2.3 Ustaw zmienną środowiskową

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2.4 Jak działa śledzenie w aplikacji

- `ReactGA.initialize()` uruchamia się w `src/App.tsx`
- `AnalyticsListener` wysyła `pageview` przy każdej zmianie trasy React Router
- Śledzone są m.in.: `/`, `/login`, `/contracts`, `/settings`, `/contracts/new`, `/diff/...`

### 2.5 Weryfikacja

1. Uruchom aplikację z uzupełnionym `VITE_GA_MEASUREMENT_ID`
2. Przeklikaj kilka podstron
3. W GA4: **Reports → Realtime** — powinny pojawić się aktywni użytkownicy i pageview
4. **DebugView** (opcjonalnie): włącz w rozszerzeniu [Google Analytics Debugger](https://chrome.google.com/webstore) w Chrome

### 2.6 Screen do dokumentacji

Zrób zrzut ekranu z **Reports → Realtime** lub **Engagement → Pages and screens** i podmień plik:

```text
docs/screenshots/google-analytics.png
```

---

## Krok 3 — Hotjar

### 3.1 Utwórz konto i witrynę

1. Wejdź na [Hotjar](https://www.hotjar.com/) i załóż konto.
2. **Add new site** — podaj URL wdrożonej aplikacji (Hotjar najlepiej działa na publicznym HTTPS, nie na localhost).

### 3.2 Pobierz Site ID

1. **Site settings** (ustawienia witryny)
2. Znajdź **Site ID** (liczba, np. `3847291`)

### 3.3 Ustaw zmienne środowiskowe

```env
VITE_HOTJAR_SITE_ID=3847291
VITE_HOTJAR_VERSION=6
```

> `VITE_HOTJAR_VERSION=6` to wersja biblioteki Hotjar — zostaw `6`, chyba że dokumentacja Hotjar wskaże inną.

### 3.4 Weryfikacja

1. Wdróż aplikację lub uruchom lokalnie z ustawionym `VITE_HOTJAR_SITE_ID`
2. Wejdź na stronę i wykonaj kilka akcji (kliknij menu, formularz logowania)
3. W panelu Hotjar sprawdź:
   - **Recordings** — czy pojawiają się nagrania sesji
   - **Heatmaps** — po zebraniu wystarczającej liczby kliknięć

### 3.5 Screen do dokumentacji

Zrób zrzut z panelu Hotjar (Recordings lub Heatmaps) i podmień:

```text
docs/screenshots/hotjar.png
```

---

## Krok 4 — Deploy na Railway

### 4.1 Przygotuj repozytorium

Upewnij się, że branch z kodem jest wypushowany na GitHub/GitLab:

```bash
git push -u origin new-requirements
```

### 4.2 Utwórz projekt Railway

1. Wejdź na [Railway](https://railway.com/)
2. **New Project → Deploy from GitHub repo**
3. Wybierz repozytorium `api-manager`
4. Wybierz branch (np. `new-requirements`)

Railway odczyta `railway.json`:

- **Build:** `npm run build`
- **Start:** `npm run start` (serwuje folder `dist/`)

### 4.3 Ustaw zmienne środowiskowe

W Railway: **Project → Service → Variables** — dodaj **wszystkie** zmienne z `.env`:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GA_MEASUREMENT_ID=
VITE_HOTJAR_SITE_ID=
VITE_HOTJAR_VERSION=6
```

> **Ważne:** Vite wstawia zmienne `VITE_*` w czasie **buildu**. Po każdej zmianie zmiennych w Railway uruchom **Redeploy**.

### 4.4 Wygeneruj publiczny URL

1. **Settings → Networking → Generate Domain**
2. Skopiuj URL, np. `https://api-manager-production.up.railway.app`

### 4.5 Dokończ konfigurację po deployu

| Usługa | Co zrobić po otrzymaniu URL Railway |
|--------|-------------------------------------|
| Firebase | Dodaj domenę Railway w **Authorized domains** |
| Google Analytics | Dodaj URL w strumieniu danych Web (lub utwórz osobny) |
| Hotjar | Ustaw URL witryny na domenę Railway |

### 4.6 Weryfikacja deployu

1. Otwórz publiczny URL Railway
2. Zaloguj się przez Firebase
3. Przeklikaj podstrony
4. Sprawdź GA4 Realtime i panel Hotjar (może zająć kilka minut)

### 4.7 Screen deployu do dokumentacji

Opcjonalnie dodaj screen z Railway (widok działającego deploymentu) do README.

---

## Krok 5 — Checklist końcowy

Użyj tej listy przed oddaniem projektu:

- [ ] Plik `.env` lokalnie uzupełniony i działa `npm run dev`
- [ ] Logowanie przez Firebase (nie mock) — email/hasło z konsoli lub rejestracja
- [ ] Wylogowanie działa i chronione trasy przekierowują na `/login`
- [ ] `VITE_GA_MEASUREMENT_ID` ustawione — widać ruch w GA4 Realtime
- [ ] `VITE_HOTJAR_SITE_ID` ustawione — widać sesje/nagrania w Hotjar
- [ ] Aplikacja wdrożona na Railway z publicznym URL
- [ ] Domena Railway dodana w Firebase Authorized domains
- [ ] `npm run build` przechodzi lokalnie
- [ ] `npm test` przechodzi lokalnie
- [ ] README zawiera screeny aplikacji (`docs/screenshots/`)
- [ ] README zawiera **prawdziwe** screeny GA i Hotjar (nie mocki)

---

## Typowe problemy

### Logowanie działa lokalnie, ale nie na Railway

- Sprawdź **Authorized domains** w Firebase — dodaj domenę `*.up.railway.app`
- Sprawdź, czy zmienne `VITE_FIREBASE_*` są ustawione w Railway **przed** buildem
- Zrób **Redeploy** po dodaniu zmiennych

### GA4 nie pokazuje pageview

- Upewnij się, że `VITE_GA_MEASUREMENT_ID` jest ustawione przed buildem
- Przeklikaj strony — SPA wymaga `AnalyticsListener` (już jest w kodzie)
- Sprawdź zakładkę **Realtime**, nie History (dane historyczne mogą mieć opóźnienie)

### Hotjar nie nagrywa sesji

- Hotjar wymaga publicznego URL — localhost często nie wystarcza
- Sprawdź, czy `VITE_HOTJAR_SITE_ID` to liczba (bez cudzysłowów w Railway)
- Wyłącz adblocker podczas testów
- Poczekaj kilka minut po pierwszej wizycie

### Railway — biała strona lub 404 na podstronach

- Używamy `serve -s` (SPA mode) — plik `package.json` ma `"start": "serve dist -s -l ${PORT:-4173}"`
- Upewnij się, że build zakończył się sukcesem w logach Railway

### Build Railway pada na zmiennych

- Wszystkie `VITE_*` muszą być ustawione w Variables przed deployem
- Po zmianie zmiennych zawsze uruchom ponowny deploy

### Build Railway pada na wersji Node.js (`Vite requires Node.js version 20.19+`)

Railway/Nixpacks domyślnie używa Node 18. Projekt wymaga **Node >= 20.19** (Vite).

W repozytorium są już pliki wymuszające Node 22:

- `.nvmrc` → `22`
- `engines.node` w `package.json` → `22.x`
- `nixpacks.toml` → `NIXPACKS_NODE_VERSION = "22"`

Jeśli build nadal używa Node 18, dodaj w Railway **Variables**:

```env
NIXPACKS_NODE_VERSION=22
```

i uruchom **Redeploy**.

### Build Railway pada na `undefined variable 'nodejs_24'`

Ten błąd pojawia się, gdy w `nixpacks.toml` jest ustawiony stary `nixpkgsArchive`, a Railway próbuje użyć Node 24. **Nie pinuj archiwum nixpkgs** — wystarczy `NIXPACKS_NODE_VERSION=22`.

Sprawdź też w Railway Variables, czy nie masz przypadkiem `NIXPACKS_NODE_VERSION=24` — usuń lub zmień na `22`.

---

## Szybki szablon `.env`

```env
# Firebase
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=twoj-projekt.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=twoj-projekt
VITE_FIREBASE_STORAGE_BUCKET=twoj-projekt.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Google Analytics 4
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Hotjar
VITE_HOTJAR_SITE_ID=1234567
VITE_HOTJAR_VERSION=6
```

---

## Powiązane pliki w repozytorium

| Plik | Rola |
|------|------|
| `.env.example` | Szablon zmiennych |
| `src/lib/firebase.ts` | Inicjalizacja Firebase |
| `src/services/authService.ts` | Logowanie, rejestracja, wylogowanie |
| `src/components/AnalyticsListener.tsx` | Pageview przy zmianie trasy |
| `src/App.tsx` | Inicjalizacja GA4 i Hotjar |
| `railway.json` | Konfiguracja deployu |
| `README.md` | Dokumentacja projektu ze screenami |
