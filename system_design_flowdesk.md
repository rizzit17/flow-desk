System Design
-------------

### Database Schema

#### Table: requests

FieldTypeNotesidUUID / VARCHAR(36)Primary keytitleVARCHAR(255)RequireddescriptionTEXTRequiredrequester\_idVARCHAR(50)Foreign reference to legacy employee IDcategoryVARCHAR(50)Nullable until classifiedurgency\_scoreINT0-100, nullable until classifiedfinal\_priorityINT1-5, nullable until C++ engine runsqueue\_positionINTNullable until C++ engine runsrequester\_departmentVARCHAR(100)Nullable until SOAP enrichmentrequester\_manager\_emailVARCHAR(150)Nullable until SOAP enrichmentstatusVARCHAR(30)PENDING / PROCESSED / PROCESSING\_FAILEDerror\_detailTEXTNullable, populated on partial failurecreated\_atTIMESTAMPDefault nowupdated\_atTIMESTAMPUpdated on each pipeline step

#### Table: users

FieldTypeNotesemployee\_idVARCHAR(50)Primary keynameVARCHAR(100)departmentVARCHAR(100)manager\_emailVARCHAR(150)

#### Table: logs

FieldTypeNotesidBIGINT AUTO\_INCREMENTPrimary keyrequest\_idVARCHAR(36)Foreign key → requests.idstepVARCHAR(50)CLASSIFY / PRIORITIZE / SOAP\_ENRICHstatusVARCHAR(20)SUCCESS / FAILUREdetailTEXTError message or summarytimestampTIMESTAMPDefault now

### API Endpoint Definitions

#### POST /api/requests

Request:

json

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   { "title": "VPN not connecting", "description": "Cannot connect to corp VPN since this morning, blocking all work", "requesterId": "E1023" }   `

Response 201:

json

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   { "id": "a1b2c3d4-...", "status": "PENDING" }   `

#### GET /api/requests

Response 200:

json

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   [    {      "id": "a1b2c3d4-...",      "title": "VPN not connecting",      "category": "IT_INFRASTRUCTURE",      "urgencyScore": 82,      "finalPriority": 1,      "queuePosition": 3,      "requesterDepartment": "Engineering",      "requesterManagerEmail": "manager@company.com",      "status": "PROCESSED"    }  ]   `

#### GET /api/requests/{id}

Returns a single ticket object in the same shape as above.

#### PATCH /api/requests/{id}

Request:

json

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   { "status": "RESOLVED" }   `

Response 200: updated ticket object

### C++ Algorithm Module

**Approach:** Binary max-heap based priority scheduler.

*   Each incoming request is converted into a weighted score: weightedScore = urgencyScore \* categoryWeight, where categoryWeight is a small fixed lookup (e.g., SECURITY=1.5, IT\_INFRASTRUCTURE=1.2, GENERAL=1.0)
    
*   The request is inserted into a max-heap keyed on weightedScore — O(log n) insertion
    
*   finalPriority is derived by bucketing the weighted score into 5 tiers (e.g., >90 → 1 \[highest\], 70-90 → 2, ... <20 → 5)
    
*   queuePosition is computed by simulating the heap's current contents (read from a small persisted state file or passed in as context) and returning the 1-indexed rank of the new item after insertion
    
*   Time complexity: O(log n) per insertion, O(n log n) if reordering the full queue is ever required — acceptable for expected internal ticket volumes (hundreds, not millions)
    

### Classification Logic (Python)

**Approach for 1-day MVP:** Keyword-weighted scoring, upgradeable to TF-IDF/sklearn if time allows.

1.  Lowercase and tokenize title + description
    
2.  Match tokens against a hardcoded dictionary of category keywords (e.g., "vpn", "server", "network" → IT\_INFRASTRUCTURE; "breach", "password", "phishing" → SECURITY; "payroll", "benefits" → HR)
    
3.  Category with the highest keyword match count wins; default to GENERAL if no matches
    
4.  urgencyScore computed from presence of urgency-signal words ("urgent", "blocking", "down", "cannot", "immediately") plus a base score, capped at 100
    
5.  confidence = matched keyword count normalized against total tokens, capped at 1.0
    
6.  Stretch goal: replace the keyword dictionary with a TfidfVectorizer + cosine similarity against labeled example tickets if time remains after MVP is verified working
    

### Error Handling Strategy

*   Each downstream call (Python, C++, SOAP) in RequestService is wrapped in its own try-catch
    
*   On failure of any single step:
    
    *   Log the failure to the logs table with the specific step and error detail
        
    *   Continue processing remaining steps where possible (independent steps don't block each other)
        
    *   If any step failed, set final ticket status to PROCESSING\_FAILED and populate error\_detail; otherwise PROCESSED
        
    *   Return HTTP 200 with the partial ticket data rather than a 500, since a partially-enriched ticket is still useful to a human reviewer
        
*   Frontend displays a visible "partially processed" badge when status = PROCESSING\_FAILED, without blocking the user from viewing the ticket
    

### Scalability Considerations (Brief)

*   Current design is synchronous and single-instance; acceptable for an internal tool with low request volume
    
*   For scale: convert the classify → prioritize → enrich pipeline to an async event-driven flow (e.g., message queue) so Spring Boot doesn't block on three sequential network calls per request
    
*   The C++ engine's subprocess-per-call model would need to become a persistent service (HTTP or gRPC) under higher load to avoid process spawn overhead
    
*   Database reads for GET /api/requests would need pagination and an index on status/final\_priority once ticket volume grows beyond a few thousand rows
    
*   SOAP legacy dependency is a natural bottleneck; a caching layer for employee metadata (rarely changes) would reduce redundant legacy calls