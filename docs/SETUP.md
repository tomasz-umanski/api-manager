# Instrukcja konfiguracji i uruchomienia

Dokument opisuje wymagane kroki konfiguracji projektu **API Manager**. Integracja z usługami zewnętrznymi jest zaimplementowana w kodzie; poniższe czynności polegają na utworzeniu kont w odpowiednich serwisach i uzupełnieniu zmiennych środowiskowych.

**Powiązane dokumenty:** [README.md](../README.md) · [SPECIFICATION.md](SPECIFICATION.md) · [SUMMARY.md](SUMMARY.md)

---

## Spis treści

1. [Wymagania wstępne](#1-wymagania-wstępne)
2. [Przegląd konfiguracji](#2-przegląd-konfiguracji)
3. [Środowisko lokalne](#3-środowisko-lokalne)
4. [Firebase Authentication](#4-firebase-authentication)
5. [Google Analytics 4](#5-google-analytics-4)
6. [Hotjar](#6-hotjar)
7. [Wdrożenie na Railway](#7-wdrożenie-na-railway)

---

## 1. Wymagania wstępne

| Wymaganie | Wersja / uwagi |
|-----------|----------------|
| Node.js | **22.x** (pliki `.nvmrc`, `engines` w `package.json`) |
| npm | dowolna wersja kompatybilna z Node 22 |
| Konto Firebase | [Firebase Console](https://console.firebase.google.com/) |
| Konto Google Analytics | [Google Analytics](https://analytics.google.com/) |
| Konto Hotjar | [Hotjar](https://www.hotjar.com/) |
| Konto Railway | [Railway](https://railway.com/) — do wdrożenia produkcyjnego |

---

## 2. Przegląd konfiguracji

### Stan integracji w repozytorium

| Usługa | Implementacja | Konfiguracja |
|--------|---------------|--------------|
| Firebase Authentication | `src/lib/firebase.ts`, `src/services/authService.ts` | zmienne `VITE_FIREBASE_*` |
| Chronione trasy | `src/components/layout/ProtectedRoute.tsx` | wymaga Firebase |
| Google Analytics 4 | `react-ga4` w `src/App.tsx`, `src/components/AnalyticsListener.tsx` | `VITE_GA_MEASUREMENT_ID` |
| Hotjar | `@hotjar/browser` w `src/App.tsx`, `AnalyticsListener` | `VITE_HOTJAR_SITE_ID`, `VITE_HOTJAR_VERSION` |
| Deploy | `railway.json`, `nixpacks.toml` | zmienne środowiskowe w Railway |

### Wymagane czynności konfiguracyjne

1. Utworzenie projektu Firebase i włączenie logowania Email/Password.
2. Utworzenie właściwości GA4 i strumienia danych Web.
3. Utworzenie witryny Hotjar.
4. Uzupełnienie pliku `.env` lokalnie oraz zmiennych w Railway.
5. Wdrożenie aplikacji i dodanie domeny produkcyjnej w Firebase.
6. Weryfikacja działania usług oraz aktualizacja zrzutów ekranu w dokumentacji.

### Zmienne środowiskowe

Szablon: `.env.example`. Wszystkie zmienne `VITE_*` są wstawiane przez Vite w czasie **buildu** — po ich zmianie na Railway wymagany jest ponowny deploy.

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Google Analytics 4
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Hotjar
VITE_HOTJAR_SITE_ID=
VITE_HOTJAR_VERSION=6
```

> **Tryb deweloperski bez Firebase:** gdy `VITE_FIREBASE_API_KEY` nie jest ustawione, aplikacja uruchamia mockowe logowanie (dowolny email i hasło). Do wdrożenia produkcyjnego i oddania projektu wymagana jest pełna konfiguracja Firebase.

---

## 3. Środowisko lokalne

### 3.1 Klonowanie repozytorium

```bash
git clone https://github.com/tomasz-umanski/api-manager.git
cd api-manager
```

### 3.2 Instalacja zależności

```bash
npm install
```

### 3.3 Plik środowiskowy

```bash
cp .env.example .env
```

Plik `.env` nie jest commitowany do repozytorium (wpis w `.gitignore`). Uzupełnij zmienne zgodnie z sekcjami 4–6.

### 3.4 Uruchomienie serwera deweloperskiego

```bash
npm run dev
```

Aplikacja dostępna pod adresem: **http://localhost:5173/**

### 3.5 Pozostałe polecenia

| Polecenie | Opis |
|-----------|------|
| `npm run build` | Build produkcyjny (TypeScript + Vite) |
| `npm run start` | Serwowanie katalogu `dist/` |
| `npm run preview:prod` | Build i uruchomienie lokalne (symulacja produkcji) |
| `npm test` | Testy jednostkowe (Vitest) |
| `npm run lint` | Analiza statyczna (ESLint) |

---

## 4. Firebase Authentication

### 4.1 Utworzenie projektu

1. Otwórz [Firebase Console](https://console.firebase.google.com/).
2. Wybierz **Add project** i podaj nazwę projektu (np. `api-manager`).
3. Dokończ kreator tworzenia projektu.

### 4.2 Rejestracja aplikacji webowej

1. W panelu projektu wybierz ikonę **Web** (`</>`).
2. Zarejestruj aplikację (np. `api-manager-web`).
3. Skopiuj wartości z obiektu `firebaseConfig` i przenieś je do `.env`:

| Firebase Console | Zmienna w `.env` |
|------------------|------------------|
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |

### 4.3 Włączenie metody logowania

1. Przejdź do **Build → Authentication → Get started**.
2. Otwórz zakładkę **Sign-in method**.
3. Włącz metodę **Email/Password** (pierwsza opcja, bez linków emailowych).

### 4.4 Utworzenie użytkownika

**Opcja A — Firebase Console**

1. **Authentication → Users → Add user**
2. Podaj adres email i hasło (minimum 6 znaków).

**Opcja B — aplikacja**

1. Uruchom `npm run dev`.
2. Na trasie `/login` użyj przycisku **Register new account**.

### 4.5 Autoryzowane domeny

1. Przejdź do **Authentication → Settings → Authorized domains**.
2. Domena `localhost` jest dodawana domyślnie — pozostaw ją bez zmian.
3. Po wdrożeniu na Railway dodaj domenę produkcyjną (np. `api-manager-production-0456.up.railway.app`).

Bez dodania domeny produkcyjnej logowanie na wdrożonej aplikacji zwróci błąd `auth/unauthorized-domain`.

### 4.6 Weryfikacja

```bash
npm run dev
```

1. Otwórz `http://localhost:5173/login`.
2. Zaloguj się kontem utworzonym w Firebase.
3. Sprawdź przekierowanie na dashboard oraz działanie wylogowania z menu bocznego.

---

## 5. Google Analytics 4

### 5.1 Utworzenie właściwości

1. Otwórz [Google Analytics](https://analytics.google.com/).
2. Przejdź do **Admin → Create → Property**.
3. Utwórz właściwość (np. `API Manager`).

### 5.2 Utworzenie strumienia danych Web

1. **Admin → Data streams → Add stream → Web**
2. Podaj adres URL:
   - lokalnie: `http://localhost:5173`
   - po wdrożeniu: domenę Railway (osobny strumień lub aktualizacja istniejącego)
3. Skopiuj **Measurement ID** w formacie `G-XXXXXXXXXX`.

### 5.3 Konfiguracja w projekcie

Ustaw zmienną w pliku `.env`:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 5.4 Działanie śledzenia w aplikacji SPA

- Inicjalizacja: `ReactGA.initialize()` w `src/App.tsx`.
- Przy każdej zmianie trasy React Router komponent `AnalyticsListener` wysyła event `pageview`.
- Śledzone trasy obejmują m.in.: `/`, `/login`, `/contracts`, `/contracts/new`, `/settings`, `/diff/:contractId/:runId`.

### 5.5 Weryfikacja

1. Uruchom aplikację z uzupełnioną zmienną `VITE_GA_MEASUREMENT_ID`.
2. Przejdź przez kilka podstron aplikacji.
3. W panelu GA4 otwórz **Reports → Realtime** — powinny pojawić się aktywni użytkownicy i odsłony stron.

---

## 6. Hotjar

### 6.1 Utworzenie witryny

1. Otwórz [Hotjar](https://www.hotjar.com/) i utwórz konto.
2. Wybierz **Add new site** i podaj URL wdrożonej aplikacji.

> Hotjar wymaga publicznego adresu HTTPS. Śledzenie na `localhost` może być ograniczone — pełna weryfikacja przeprowadzana jest po wdrożeniu na Railway.

### 6.2 Pobranie identyfikatora witryny

1. Przejdź do **Site settings**.
2. Skopiuj **Site ID** (liczba całkowita).

### 6.3 Konfiguracja w projekcie

Ustaw zmienne w pliku `.env`:

```env
VITE_HOTJAR_SITE_ID=1234567
VITE_HOTJAR_VERSION=6
```

### 6.4 Konfiguracja aplikacji SPA

Aplikacja korzysta z React Router — zmiana trasy nie powoduje przeładowania strony. Przy każdej nawigacji `AnalyticsListener` wywołuje `Hotjar.stateChange(path)`.

W panelu Hotjar (**Site settings → Tracking code / URL changes**) ustaw śledzenie zmian adresu URL na:

- **Track changes manually** (zalecane), lub
- **Automatic** — jeśli weryfikacja nie przechodzi, przełącz na tryb manualny.

### 6.5 Weryfikacja

1. Wdróż aplikację na publiczny adres HTTPS.
2. Otwórz `/login`, zaloguj się i przejdź przez menu (Dashboard, Contracts, Settings).
3. W panelu Hotjar sprawdź:
   - **Recordings** — nagrania sesji użytkowników
   - **Heatmaps** — mapy kliknięć (po zebraniu wystarczającej liczby interakcji)

---

## 7. Wdrożenie na Railway

### 7.1 Wypchnięcie kodu do repozytorium

Upewnij się, że branch z aktualnym kodem jest dostępny na GitHub:

```bash
git push -u origin <nazwa-brancha>
```

### 7.2 Utworzenie projektu Railway

1. Otwórz [Railway](https://railway.com/).
2. Wybierz **New Project → Deploy from GitHub repo**.
3. Wskaż repozytorium `api-manager` i branch do wdrożenia.

Railway odczytuje konfigurację z `railway.json`:

| Etap | Polecenie |
|------|-----------|
| Build | `npm run build` |
| Start | `npm run start` (serwowanie `dist/` w trybie SPA) |

### 7.3 Zmienne środowiskowe

W **Project → Service → Variables** ustaw wszystkie zmienne z `.env.example`:

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

Po każdej zmianie zmiennych uruchom **Redeploy**.

### 7.4 Publiczny adres URL

1. Przejdź do **Settings → Networking → Generate Domain**.
2. Skopiuj wygenerowany adres (np. `https://api-manager-production-0456.up.railway.app`).

### 7.5 Konfiguracja po wdrożeniu

| Usługa | Wymagana czynność |
|--------|-------------------|
| Firebase | Dodaj domenę Railway w **Authorized domains** |
| Google Analytics | Zaktualizuj lub dodaj strumień danych Web z adresem Railway |
| Hotjar | Ustaw URL witryny na domenę Railway |

### 7.6 Weryfikacja wdrożenia

1. Otwórz publiczny adres Railway.
2. Zaloguj się przez Firebase Authentication.
3. Przejdź przez główne trasy aplikacji.
4. Sprawdź dane w GA4 (**Realtime**) i panelu Hotjar (dane mogą pojawić się z opóźnieniem kilku minut).

### 7.7 Wersja Node.js na Railway

Projekt wymaga Node.js **22.x**. W repozytorium skonfigurowano:

- `.nvmrc` → `22`
- `engines.node` w `package.json` → `22.x`
- `nixpacks.toml` → `NIXPACKS_NODE_VERSION = "22"`

Jeśli build używa starszej wersji Node, dodaj w Railway Variables:

```env
NIXPACKS_NODE_VERSION=22
```

i uruchom ponowny deploy.