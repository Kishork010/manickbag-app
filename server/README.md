# Manickbag Backend — Additions Guide

## Files in This Package

| File | Purpose |
|---|---|
| `manickbag_db_additions.sql` | Run AFTER existing SQL — adds 9 new tables + updated views |
| `server_additions.js` | Paste into existing `server.js` before `app.listen()` |
| `api_additions.php` | Paste into existing `api.php` (or include separately) |
| `apiService.js` | Replace existing `src/services/apiService.js` entirely |

---

## Step 1 — Run the SQL

```bash
mysql -u root -p manickbag_db < manickbag_db_additions.sql
```

This adds **9 new tables**:

| Table | Page |
|---|---|
| `offer_enquiries` | CurrentOffers.jsx |
| `corporate_enquiries` | CorporateDeals.jsx |
| `exchange_enquiries` | ExchangeBonus.jsx |
| `finance_applications` | FinanceSchemes.jsx |
| `service_bookings` | Service.jsx |
| `fastag_enquiries` | FASTag.jsx |
| `insurance_enquiries` | Insurance.jsx |
| `accessory_enquiries` | Accessories.jsx |
| `vas_bookings` | VAS.jsx |

Plus updates `v_enquiry_summary` view to include all tables and adds `v_daily_stats` view.

---

## Step 2 — Update server.js (Node)

Open your existing `server.js` and paste the contents of `server_additions.js`
**just before** your `app.listen(...)` call.

---

## Step 3 — Update api.php (PHP alternative)

Open your existing `api.php` and paste the contents of `api_additions.php`
at the bottom of the routing block.

---

## Step 4 — Replace apiService.js (Frontend)

Copy `apiService.js` to `src/services/apiService.js` in your React project.

---

## Step 5 — Wire forms to API

See the **USAGE EXAMPLES** section at the bottom of `apiService.js`
for exact code snippets for each page.

---

## API Endpoints Summary

### New Endpoints

| Method | Endpoint | Page |
|---|---|---|
| POST | `/api/offer-enquiries` | CurrentOffers |
| GET  | `/api/offer-enquiries` | Admin |
| POST | `/api/corporate-enquiries` | CorporateDeals |
| GET  | `/api/corporate-enquiries` | Admin |
| POST | `/api/exchange-enquiries` | ExchangeBonus |
| GET  | `/api/exchange-enquiries` | Admin |
| POST | `/api/finance-applications` | FinanceSchemes |
| GET  | `/api/finance-applications` | Admin |
| POST | `/api/service-bookings` | Service |
| GET  | `/api/service-bookings` | Admin |
| GET  | `/api/service-bookings/slots` | Service (slot check) |
| POST | `/api/fastag-enquiries` | FASTag |
| GET  | `/api/fastag-enquiries` | Admin |
| POST | `/api/insurance-enquiries` | Insurance |
| GET  | `/api/insurance-enquiries` | Admin |
| POST | `/api/accessory-enquiries` | Accessories |
| GET  | `/api/accessory-enquiries` | Admin |
| POST | `/api/vas-bookings` | VAS |
| GET  | `/api/vas-bookings` | Admin |
| GET  | `/api/admin/stats` | Admin Dashboard |
| PATCH | `/api/:table/:id/status` | Admin (any table) |

---

## Environment Variables

Make sure your `.env` has:

```
VITE_API_URL=http://localhost:5000/api   # development
VITE_API_URL=https://yourdomain.com/api  # production
```

# Manickbag Backend — Additions Guide

## Files in This Package

| File | Purpose |
|---|---|
| `manickbag_db_additions.sql` | Run AFTER existing SQL — adds 9 new tables + updated views |
| `server_additions.js` | Paste into existing `server.js` before `app.listen()` |
| `api_additions.php` | Paste into existing `api.php` (or include separately) |
| `apiService.js` | Replace existing `src/services/apiService.js` entirely |

---

## Step 1 — Run the SQL

```bash
mysql -u root -p manickbag_db < manickbag_db_additions.sql
```

This adds **9 new tables**:

| Table | Page |
|---|---|
| `offer_enquiries` | CurrentOffers.jsx |
| `corporate_enquiries` | CorporateDeals.jsx |
| `exchange_enquiries` | ExchangeBonus.jsx |
| `finance_applications` | FinanceSchemes.jsx |
| `service_bookings` | Service.jsx |
| `fastag_enquiries` | FASTag.jsx |
| `insurance_enquiries` | Insurance.jsx |
| `accessory_enquiries` | Accessories.jsx |
| `vas_bookings` | VAS.jsx |

Plus updates `v_enquiry_summary` view to include all tables and adds `v_daily_stats` view.

---

## Step 2 — Update server.js (Node)

Open your existing `server.js` and paste the contents of `server_additions.js`
**just before** your `app.listen(...)` call.

---

## Step 3 — Update api.php (PHP alternative)

Open your existing `api.php` and paste the contents of `api_additions.php`
at the bottom of the routing block.

---

## Step 4 — Replace apiService.js (Frontend)

Copy `apiService.js` to `src/services/apiService.js` in your React project.

---

## Step 5 — Wire forms to API

See the **USAGE EXAMPLES** section at the bottom of `apiService.js`
for exact code snippets for each page.

---

## API Endpoints Summary

### New Endpoints

| Method | Endpoint | Page |
|---|---|---|
| POST | `/api/offer-enquiries` | CurrentOffers |
| GET  | `/api/offer-enquiries` | Admin |
| POST | `/api/corporate-enquiries` | CorporateDeals |
| GET  | `/api/corporate-enquiries` | Admin |
| POST | `/api/exchange-enquiries` | ExchangeBonus |
| GET  | `/api/exchange-enquiries` | Admin |
| POST | `/api/finance-applications` | FinanceSchemes |
| GET  | `/api/finance-applications` | Admin |
| POST | `/api/service-bookings` | Service |
| GET  | `/api/service-bookings` | Admin |
| GET  | `/api/service-bookings/slots` | Service (slot check) |
| POST | `/api/fastag-enquiries` | FASTag |
| GET  | `/api/fastag-enquiries` | Admin |
| POST | `/api/insurance-enquiries` | Insurance |
| GET  | `/api/insurance-enquiries` | Admin |
| POST | `/api/accessory-enquiries` | Accessories |
| GET  | `/api/accessory-enquiries` | Admin |
| POST | `/api/vas-bookings` | VAS |
| GET  | `/api/vas-bookings` | Admin |
| GET  | `/api/admin/stats` | Admin Dashboard |
| PATCH | `/api/:table/:id/status` | Admin (any table) |

---

## Environment Variables

Make sure your `.env` has:

```
VITE_API_URL=http://localhost:5000/api   # development
VITE_API_URL=https://yourdomain.com/api  # production
```