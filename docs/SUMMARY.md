## **1. Wprowadzenie**

**Api Manager** to narzędzie stworzone w celu eliminacji problemów związanych z niekontrolowanymi zmianami w API w architekturze mikroserwisowej oraz przy integracjach z zewnętrznymi dostawcami.

Projekt odpowiada na kluczowy problem zespołów developerskich: brak widoczności i kontroli nad kontraktami API, co prowadzi do awarii produkcyjnych spowodowanych niezapowiedzianymi zmianami.

Celem aplikacji jest zapewnienie jednego źródła prawdy dla kontraktów API oraz automatyczne wykrywanie i komunikowanie zmian.

---

## **2. Problem**

Zespoły pracujące z API napotykają następujące problemy:

- Brak centralnego miejsca przechowywania kontraktów API
- Zmiany w API wprowadzane bez komunikacji
- Wykrywanie błędów dopiero na produkcji
- Brak informacji o tym, kto jest zależny od danego API
- Brak narzędzi do analizy wpływu zmian

Typowe scenariusze problemowe:

- Usunięcie pola z odpowiedzi API
- Zmiana typu danych (np. string → number)
- Dodanie nowego wymaganego parametru
- Zmiana struktury payloadu

---

## **3. Rozwiązanie**

Api Manager wprowadza system zarządzania kontraktami API wraz z ich automatycznym monitoringiem.

### **Główne funkcjonalności**

### **3.1 Rejestr kontraktów**

- Rejestracja API poprzez:
    - URL endpointu
    - Specyfikację OpenAPI / JSON Schema
    - Formularz w UI
- Każdy kontrakt zawiera:
    - właściciela (Provider)
    - konsumentów (Consumers)
    - wersję
    - schemat request/response

### **3.2 Automatyczny monitoring**

- Cykliczne sprawdzanie endpointów
- Walidacja odpowiedzi względem zdefiniowanego schematu
- Wykrywanie:
    - brakujących pól
    - zmian typów
    - nowych wymaganych pól
- Klasyfikacja zmian:
    - breaking
    - non-breaking

### **3.3 Diff kontraktów**

- Porównanie wersji kontraktu (przed / po)
- Wizualna prezentacja zmian
- Identyfikacja:
    - co się zmieniło
    - kto jest dotknięty zmianą
    - poziom ryzyka

### **3.4 System powiadomień**

- Alerty w przypadku:
    - naruszenia kontraktu
    - publikacji nowej wersji
- Kanały:
    - Slack (MVP)
    - e-mail (docelowo)
    - webhooki (docelowo)

### **3.5 Dashboard**

- Lista wszystkich kontraktów
- Status zgodności
- Historia naruszeń
- Widoczność zależności między zespołami

---

## **4. Przykładowy przepływ użytkownika**

1. Użytkownik rejestruje API (URL + schema)
2. System zapisuje kontrakt i przypisuje właściciela
3. Użytkownik uruchamia manualne sprawdzenie
4. System:
    - odpytuje endpoint
    - porównuje odpowiedź ze schematem
5. W przypadku wykrycia różnic:
    - generowany jest diff
    - wysyłane jest powiadomienie (Slack)
6. Informacja trafia na dashboard

---

## **5. Wartość biznesowa**

- Redukcja błędów produkcyjnych
- Lepsza komunikacja między zespołami
- Szybsze wykrywanie problemów
- Transparentność zależności między systemami
- Standaryzacja zarządzania API

---

## **6. MVP (Minimum Viable Product)**

Przykładowe MVP

### **Funkcjonalności**

- Rejestracja API:
    - poprzez URL
    - poprzez OpenAPI spec
- Manualne uruchomienie sprawdzenia kontraktu
- Prosty widok różnic (diff):
    - porównanie schematów
- Integracja z jednym kanałem powiadomień:
    - Slack
- Dashboard:
    - lista kontraktów
    - aktualny status

---

*Ostatnia aktualizacja: 2026-04-15*