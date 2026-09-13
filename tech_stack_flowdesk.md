Tech Stack
----------

### Frontend

*   **Technology:** React + TypeScript (Vite)
    
*   **Why:** Fast local dev server, minimal config, TypeScript demonstrates typed frontend engineering rather than loose JS
    
*   **Alternative considered:** Plain HTML/JS — rejected because TypeScript is an explicit JD requirement and adds negligible build time with Vite
    

### Backend (Core Orchestration)

*   **Technology:** Java 17 + Spring Boot 3
    
*   **Why:** Industry-standard enterprise backend framework; built-in support for REST controllers, JDBC/JPA, and SOAP client integration (Spring-WS); directly matches "Java backend" requirement
    
*   **Alternative considered:** Node.js/Express — rejected because Java is an explicit requirement and Spring's ecosystem makes SOAP + REST + JDBC integration straightforward in one framework
    

### Classification/Processing Microservice

*   **Technology:** Python 3 + FastAPI
    
*   **Why:** Python is the standard choice for text classification logic; FastAPI gives async REST endpoints with minimal boilerplate and automatic OpenAPI docs, useful for quickly verifying the contract
    
*   **Alternative considered:** Flask — viable, but FastAPI's built-in request validation (Pydantic) reduces bugs in a 1-day build
    

### High-Performance Algorithm Module

*   **Technology:** C++17
    
*   **Why:** Demonstrates systems-level performance thinking; a priority queue / heap-based scheduler is a natural fit for a compiled, low-latency component and directly satisfies the "C++ high-performance module" requirement
    
*   **Alternative considered:** Implementing priority logic in Java itself — rejected because it would remove the explicit C++ demonstration the role calls for
    
*   **Integration approach:** Invoked as a subprocess via stdin/stdout JSON (fast to integrate in a day); an HTTP wrapper (httplib.h) is a stretch goal if time allows
    

### Database

*   **Technology:** H2 (file-based) or PostgreSQL
    
*   **Why:** H2 requires zero setup and persists to disk, ideal for a 1-day build without infra risk; PostgreSQL is a drop-in upgrade if Docker is already available and demonstrates real relational DB experience
    
*   **Alternative considered:** SQLite — viable, but H2 integrates more natively with Spring Boot's JDBC/JPA tooling
    

### Legacy System Integration

*   **Technology:** SOAP via Python spyne (mock server) consumed from Spring Boot via Spring-WS
    
*   **Why:** SOAP integration is explicitly required and remains common in real enterprise environments (HR, finance, ERP systems); simulating it demonstrates comfort bridging modern and legacy protocols
    
*   **Alternative considered:** Java-based SOAP mock (Spring-WS server-side) — equally valid; Python/spyne chosen here for faster standup time
    

### Primary Communication Protocol

*   **Technology:** REST (JSON over HTTP) between frontend, Java backend, and Python service
    
*   **Why:** REST is the default, well-understood integration style for the majority of the system; SOAP is deliberately isolated to only the legacy integration point, mirroring real hybrid architectures
    

### How They Interact

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Frontend (TS) --REST--> Spring Boot (Java) --REST--> Python Classifier                                |                                |--subprocess stdin/stdout--> C++ Priority Engine                                |                                |--SOAP--> Mock Legacy HR System                                |                                |--JDBC--> SQL Database   `