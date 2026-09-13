Autonomous Build Prompt: Multi-Service Workflow Automation Platform
-------------------------------------------------------------------

### ROLE

You are an autonomous coding agent tasked with building a complete, working, MVP-quality multi-service application in ONE DAY. Prioritize working end-to-end integration over polish. Every service must actually run and actually talk to the others via real network calls.

### PROJECT SUMMARY

Build "FlowDesk" - an internal ticket/request automation platform with:

*   A JavaScript/TypeScript frontend for submitting/viewing requests
    
*   A Java Spring Boot backend (core API, orchestration, persistence)
    
*   A Python microservice (request classification + priority scoring)
    
*   A C++ module (priority queue / scheduling optimization)
    
*   A mock SOAP service simulating a legacy HR system
    
*   A SQL (PostgreSQL or H2) relational database
    

### HARD CONSTRAINTS

*   Must be fully buildable and runnable locally within 1 day
    
*   No paid external dependencies (use H2 file-based DB if Postgres setup is a time risk)
    
*   Each service must be independently runnable with a documented command
    
*   Prefer simple, working code over elaborate abstractions
    
*   Comment-free code; clear naming instead of comments
    
*   Every REST/SOAP contract below must be implemented exactly as specified so services integrate without renegotiation
    

### FOLDER STRUCTURE

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   flowdesk/  ├── frontend/                  # React + TypeScript  │   ├── src/  │   │   ├── api/client.ts  │   │   ├── components/RequestForm.tsx  │   │   ├── components/RequestList.tsx  │   │   ├── App.tsx  │   │   └── main.tsx  │   ├── index.html  │   ├── package.json  │   └── vite.config.ts  │  ├── backend-java/               # Spring Boot  │   ├── src/main/java/com/flowdesk/  │   │   ├── FlowdeskApplication.java  │   │   ├── controller/RequestController.java  │   │   ├── service/RequestService.java  │   │   ├── service/ClassificationClient.java  │   │   ├── service/PriorityEngineClient.java  │   │   ├── service/LegacyHrSoapClient.java  │   │   ├── model/TicketRequest.java  │   │   ├── model/RequestStatus.java  │   │   ├── repository/TicketRepository.java  │   │   └── config/RestClientConfig.java  │   ├── src/main/resources/application.yml  │   ├── src/main/resources/schema.sql  │   ├── src/main/resources/data.sql  │   └── pom.xml  │  ├── classifier-python/           # FastAPI  │   ├── main.py  │   ├── classifier.py  │   ├── requirements.txt  │  ├── priority-engine-cpp/         # C++ module  │   ├── main.cpp  │   ├── priority_queue_engine.cpp  │   ├── priority_queue_engine.h  │   ├── CMakeLists.txt  │  ├── legacy-hr-soap/              # Mock SOAP service (Python + Spyne, or Java + Spring-WS)  │   ├── soap_server.py  │   ├── requirements.txt  │  └── README.md   `

### BUILD ORDER (STRICT SEQUENCE)

#### Step 1 - Database Schema

Create schema.sql and data.sql under Spring Boot resources implementing the schema defined in systemdesign.md. Use H2 in file mode (jdbc:h2:file:./flowdeskdb) for zero-setup persistence, OR PostgreSQL if Docker is available. Auto-run schema on startup via spring.sql.init.mode=always.

#### Step 2 - C++ Priority Engine (build first since Java depends on it)

*   Implement a max-heap based priority scheduler in priority\_queue\_engine.cpp
    
*   Expose it as a CLI executable: reads JSON from stdin { "requestId": "...", "urgencyScore": 0-100, "category": "..." }, writes JSON to stdout { "requestId": "...", "finalPriority": 1-5, "queuePosition": N }
    
*   Compile with CMake into a static binary priority\_engine
    
*   Java will invoke this binary via ProcessBuilder, passing JSON via stdin/stdout (simplest integration path within 1-day constraint; do NOT build an HTTP server in C++ unless time remains)
    
*   If time permits, wrap with a minimal httplib.h-based REST server exposing POST /optimize instead of subprocess call — but subprocess is the required fallback
    

#### Step 3 - Python Classification Microservice

*   FastAPI app on port 8001
    
*   Endpoint: POST /classify — implement per contract in systemdesign.md
    
*   Use simple keyword/TF-IDF based scoring (scikit-learn optional; a hardcoded keyword-weight dictionary is acceptable for MVP)
    
*   Run: pip install -r requirements.txt && uvicorn main:app --port 8001
    

#### Step 4 - Mock SOAP Legacy System

*   Use Python spyne (simplest to stand up in an hour) or Java Spring-WS if agent prefers a single-language backend
    
*   Single operation: getEmployeeInfo(employeeId) returning { employeeId, name, department, managerEmail }
    
*   Expose WSDL at http://localhost:8002/hr?wsdl
    
*   Seed with 5 hardcoded employee records
    
*   Run: pip install spyne lxml && python soap\_server.py
    

#### Step 5 - Java Spring Boot Backend

*   Spring Boot 3.x, Java 17+, Maven
    
*   Implement REST endpoints per contract in systemdesign.md
    
*   RequestService orchestrates the full pipeline on ticket submission:
    
    1.  Persist raw request (status=PENDING)
        
    2.  Call Python classifier via RestTemplate/WebClient → get category + urgencyScore
        
    3.  Invoke C++ binary via ProcessBuilder → get finalPriority + queuePosition
        
    4.  Call SOAP client (Spring-WS WebServiceTemplate or generated JAX-WS client) → enrich with requester's department/manager
        
    5.  Update ticket record with all enriched fields, status=PROCESSED
        
    6.  Return full enriched ticket to caller
        
*   If any downstream service fails, catch the exception, mark ticket status=PROCESSING\_FAILED with an error field, and still return 200 with partial data (do not fail the whole request; see error handling strategy in systemdesign.md)
    
*   Run: mvn spring-boot:run (port 8080)
    

#### Step 6 - Frontend

*   React + TypeScript via Vite
    
*   Two views: submission form, request list (polling GET /requests every 5s or manual refresh button)
    
*   api/client.ts wraps fetch calls to http://localhost:8080
    
*   Run: npm install && npm run dev (port 5173)
    

#### Step 7 - Integration Test Pass

*   Start all 4 backend services in order: C++ binary (compiled, no daemon needed), Python classifier (8001), SOAP mock (8002), Spring Boot (8080), then frontend (5173)
    
*   Submit one test ticket end-to-end via the UI
    
*   Verify the ticket record shows classification, priority, and enriched HR data
    
*   Verify a fault scenario: kill the Python service, resubmit, confirm graceful degradation per Step 5.6
    

### API CONTRACTS (MUST MATCH EXACTLY)

#### Frontend → Spring Boot

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   POST /api/requests  Body: { "title": string, "description": string, "requesterId": string }  Response 201: { "id": string, "status": "PENDING" }  GET /api/requests  Response 200: [ TicketDTO, ... ]  GET /api/requests/{id}  Response 200: TicketDTO  PATCH /api/requests/{id}  Body: { "status": string }  Response 200: TicketDTO   `

#### Spring Boot → Python Classifier

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   POST http://localhost:8001/classify  Body: { "title": string, "description": string }  Response 200: { "category": string, "urgencyScore": number(0-100), "confidence": number(0-1) }   `

#### Spring Boot → C++ Engine (subprocess stdin/stdout)

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   stdin:  { "requestId": string, "urgencyScore": number, "category": string }  stdout: { "requestId": string, "finalPriority": number(1-5), "queuePosition": number }   `

#### Spring Boot → SOAP Legacy HR

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Operation: getEmployeeInfo  Request: employeeId (string)  Response: { employeeId, name, department, managerEmail }   `

### MINIMAL IMPLEMENTATION GUIDANCE

*   Do not build authentication; assume a single trusted internal network
    
*   Do not build retry/backoff logic beyond a single try-catch per downstream call
    
*   Do not over-engineer the C++ module — a binary max-heap with O(log n) insert is sufficient; no need for Fibonacci heaps or custom allocators
    
*   Use in-memory or file-based DB to avoid infra setup time loss
    
*   Use synchronous REST calls throughout; do not introduce message queues (Kafka/RabbitMQ) — out of scope for 1-day MVP
    
*   Keep the frontend deliberately simple: two components, no state management library, no CSS framework required (plain CSS acceptable)
    

### DEFINITION OF DONE

*   All 5 services start independently with documented single commands
    
*   A ticket submitted from the UI flows through classification, prioritization, and HR enrichment, and appears correctly in the list view
    
*   One documented failure path (a downstream service down) degrades gracefully instead of crashing the request
    
*   README.md documents exact run order and ports for all services