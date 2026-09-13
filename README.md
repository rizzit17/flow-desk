# FlowDesk: Multi-Service Workflow Automation Platform

FlowDesk is an internal ticket and operational request automation platform that orchestrates request intake, machine-learning classification, algorithmic priority queue scheduling, and legacy enterprise enrichment across heterogeneous services.

---

## System Architecture

```
                     ┌────────────────────────┐
                     │ Frontend (React + TS)  │  Port 5173
                     └───────────┬────────────┘
                                 │ REST (JSON/HTTP)
                                 ▼
                     ┌────────────────────────┐
                     │   Spring Boot API      │  Port 8080
                     │   (Orchestration Hub)  │  H2 Database (file)
                     └────┬───────────┬────┬──┘
             REST (8001)  │           │    │ SOAP (8002)
   ┌──────────────────────┘           │    └──────────────────────┐
   ▼                                  │                           ▼
┌──────────────────────┐   subprocess │ stdin/stdout    ┌──────────────────────┐
│ Python Classifier    │              ▼                 │ Mock Legacy HR       │
│ (FastAPI)            │   ┌──────────────────────┐     │ (SOAP / WSDL)        │
│ category, urgency    │   │ C++ Priority Engine  │     │ employee metadata    │
└──────────────────────┘   │ (Max-Heap Scheduler) │     └──────────────────────┘
                           └──────────────────────┘
```

### Component Services & Port Allocation

| Component | Technology | Role | Port / Interface |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite | Request submission form & operational queue view | `http://localhost:5173` |
| **Backend API** | Java 17, Spring Boot 3, JDBC | Central orchestration, persistence & pipeline coordination | `http://localhost:8080` |
| **Classification Service** | Python 3, FastAPI, Uvicorn | Keyword & urgency score analysis | `http://localhost:8001` |
| **Priority Engine** | C++17, CMake | Binary max-heap scheduler & queue rank calculation | Subprocess CLI (`stdin`/`stdout`) |
| **Legacy HR System** | Python, HTTP/XML SOAP 1.1 | Mock legacy enterprise employee lookup service | `http://localhost:8002/hr?wsdl` |
| **Database** | H2 Relational Database | File-based persistence (`flowdeskdb`) | `jdbc:h2:file:./flowdeskdb` |

---

## Build & Execution Instructions

Start the services in the following order. Each service runs in its own terminal.

### 1. Build C++ Priority Engine
The C++ binary must be compiled before launching the backend:
```bash
cd priority-engine-cpp
cmake -B build
cmake --build build --config Release
```
*Binary output:* `priority-engine-cpp/build/Release/priority_engine.exe` (or `priority-engine-cpp/build/priority_engine` on POSIX).

### 2. Start Python Classification Service (Port 8001)
```bash
cd classifier-python
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8001
```

### 3. Start Mock Legacy HR SOAP Service (Port 8002)
```bash
cd legacy-hr-soap
python soap_server.py
```
*Verify WSDL:* Navigate to `http://localhost:8002/hr?wsdl`.

### 4. Start Java Spring Boot Backend (Port 8080)
```bash
cd backend-java
mvn spring-boot:run
```
*Database Console:* Available at `http://localhost:8080/h2-console` (`JDBC URL: jdbc:h2:file:./flowdeskdb`, user: `sa`, password empty).

### 5. Start React Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
*Open Application:* Navigate to `http://localhost:5173`.

---

## API Contracts

### Frontend → Spring Boot API
- **POST `/api/requests`**
  - Request: `{ "title": "VPN down", "description": "Blocking work immediately", "requesterId": "E1023" }`
  - Response (201): `{ "id": "...", "status": "PENDING" }`
- **GET `/api/requests`**
  - Response (200): Array of enriched ticket objects ordered by computed priority.
- **GET `/api/requests/{id}`**
  - Response (200): Single ticket details.
- **PATCH `/api/requests/{id}`**
  - Request: `{ "status": "RESOLVED" }`
  - Response (200): Updated ticket object.

### Spring Boot → Python Classifier (`http://localhost:8001/classify`)
- **POST `/classify`**
  - Request: `{ "title": "...", "description": "..." }`
  - Response (200): `{ "category": "IT_INFRASTRUCTURE", "urgencyScore": 82, "confidence": 0.61 }`

### Spring Boot → C++ Priority Engine (Subprocess IPC)
- **Standard Input (`stdin`):**
  - `{ "requestId": "req-1", "urgencyScore": 82, "category": "IT_INFRASTRUCTURE" }`
- **Standard Output (`stdout`):**
  - `{ "requestId": "req-1", "finalPriority": 1, "queuePosition": 1 }`

### Spring Boot → Legacy HR SOAP (`http://localhost:8002/hr`)
- **Operation:** `getEmployeeInfo`
- **SOAP Request:** `<hr:getEmployeeInfo><hr:employeeId>E1023</hr:employeeId></hr:getEmployeeInfo>`
- **SOAP Response:**
  - `<hr:employeeId>E1023</hr:employeeId>`
  - `<hr:name>Jane Doe</hr:name>`
  - `<hr:department>Engineering</hr:department>`
  - `<hr:managerEmail>manager@company.com</hr:managerEmail>`

---

## Fault Tolerance & Graceful Degradation

If any downstream service becomes unavailable (e.g. stopping the Python classification service):
1. The error is isolated in an independent `try-catch` block inside `RequestService`.
2. The failure is logged to the `logs` relational audit table.
3. Subsequent pipeline stages continue executing (e.g., C++ priority calculation and SOAP enrichment still proceed).
4. The ticket is marked with `status = "PROCESSING_FAILED"` and the specific error reason is recorded in `error_detail`.
5. The API returns HTTP 201/200 with the partially enriched data rather than failing with HTTP 500.
6. The frontend displays a distinctive `⚠ PARTIAL / DEGRADED` badge along with the diagnostic error banner without blocking the user.

---

## Seeded Test Data

The legacy HR system and database come pre-seeded with 5 employee records:
- `E1023`: Jane Doe — Engineering (`manager@company.com`)
- `E1024`: John Smith — Security (`security.lead@company.com`)
- `E1025`: Alice Wong — Product (`alice.vp@company.com`)
- `E1026`: Bob Miller — HR (`hr.director@company.com`)
- `E1027`: Charlie Patel — IT Support (`it.lead@company.com`)

---

## Optional Stretch Goals (Swappable Extensions)
- **C++ HTTP Wrapper**: While subprocess IPC guarantees deterministic and zero-overhead communication for the MVP, the C++ priority engine can optionally be wrapped with `httplib.h` to expose `POST /optimize`.
- **TF-IDF Classification**: The keyword-weighted classifier can be upgraded to Scikit-Learn `TfidfVectorizer` + cosine similarity against labeled ticket datasets.
