Context: Multi-Service Workflow Automation Platform
---------------------------------------------------

### Problem Statement

Internal teams at large organizations (IT support, HR, facilities, infra) receive a constant stream of unstructured requests, tickets, and issues. Manually reading, categorizing, prioritizing, and routing each one wastes engineering and operations time and creates inconsistent response times. Requests that should be urgent get buried in a queue processed strictly by arrival time, while low-priority items sometimes get handled first because they were easier to interpret.

FlowDesk automates this pipeline: submission, classification, prioritization, and routing, while also bridging to older internal systems that were never designed with modern REST APIs in mind.

### Why This Matters to Companies Like Google

Large engineering organizations run dozens of internal tools of exactly this shape: workflow/ticket systems that glue together multiple backend services, some modern (REST microservices) and some legacy (SOAP-based HR, finance, or inventory systems that predate REST standardization). An Application Engineer is frequently the person who:

*   Integrates a new internal tool with an existing enterprise system
    
*   Builds orchestration logic across services owned by different teams
    
*   Handles graceful degradation when a dependency is unavailable
    
*   Works across the stack: from a Java service layer down to a database schema and up to a frontend
    

This project directly rehearses that reality rather than being an isolated leetcode-style exercise. It demonstrates you can design a request lifecycle, not just write one function correctly.

### Business Problem Solved

*   Reduces manual triage time for incoming operational requests
    
*   Ensures urgent requests are computationally identified rather than relying on the submitter accurately describing urgency
    
*   Provides a consistent, auditable pipeline from submission to resolution routing
    
*   Demonstrates a pattern for wrapping legacy (SOAP) systems behind a modern orchestration layer, a common real-world migration pattern
    

### Key Features

*   Ticket submission with title/description via a simple web UI
    
*   Automatic content-based classification (category + urgency score)
    
*   Computationally optimized priority assignment and queue positioning
    
*   Enrichment with requester metadata pulled from a simulated legacy HR system
    
*   Status tracking (PENDING → PROCESSED / PROCESSING\_FAILED)
    
*   Full visibility into all tickets via a list view
    

### User Flow

1.  An employee submits a request through the frontend (title, description, their employee ID)
    
2.  The system immediately acknowledges the ticket as PENDING
    
3.  Behind the scenes, the backend classifies the request, computes its priority, and enriches it with requester department/manager info
    
4.  The ticket updates to PROCESSED with all derived fields visible
    
5.  The employee (or an ops viewer) sees the enriched, prioritized ticket in the list view, sorted by computed priority
    

### Expected Outcomes

*   A working, demoable, end-to-end system built in a single day
    
*   Concrete evidence of comfort across Java, Python, C++, SQL, JavaScript/TypeScript, REST, and SOAP within one coherent system rather than disconnected snippets
    
*   A tangible artifact (repo + README + running demo) usable directly in interviews to walk through architecture decisions, trade-offs, and failure handling