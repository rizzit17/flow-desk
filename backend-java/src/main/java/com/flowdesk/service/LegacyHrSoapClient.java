package com.flowdesk.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.StringReader;

@Service
public class LegacyHrSoapClient {

    private final RestTemplate restTemplate;
    private final String soapServiceUrl;

    public LegacyHrSoapClient(RestTemplate restTemplate,
                              @Value("${flowdesk.soap.url:http://localhost:8002/hr}") String soapServiceUrl) {
        this.restTemplate = restTemplate;
        this.soapServiceUrl = soapServiceUrl;
    }

    public static class EmployeeInfo {
        private String employeeId;
        private String name;
        private String department;
        private String managerEmail;

        public EmployeeInfo() {}

        public EmployeeInfo(String employeeId, String name, String department, String managerEmail) {
            this.employeeId = employeeId;
            this.name = name;
            this.department = department;
            this.managerEmail = managerEmail;
        }

        public String getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(String employeeId) {
            this.employeeId = employeeId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDepartment() {
            return department;
        }

        public void setDepartment(String department) {
            this.department = department;
        }

        public String getManagerEmail() {
            return managerEmail;
        }

        public void setManagerEmail(String managerEmail) {
            this.managerEmail = managerEmail;
        }
    }

    public EmployeeInfo getEmployeeInfo(String employeeId) throws Exception {
        String soapEnvelope = """
            <?xml version="1.0" encoding="UTF-8"?>
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:hr="http://flowdesk.com/hr">
               <soapenv:Header/>
               <soapenv:Body>
                  <hr:getEmployeeInfo>
                     <hr:employeeId>%s</hr:employeeId>
                  </hr:getEmployeeInfo>
               </soapenv:Body>
            </soapenv:Envelope>
        """.formatted(employeeId).trim();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/xml; charset=utf-8"));
        headers.add("SOAPAction", "getEmployeeInfo");

        HttpEntity<String> entity = new HttpEntity<>(soapEnvelope, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(soapServiceUrl, entity, String.class);

        String responseBody = response.getBody();
        if (responseBody == null || responseBody.isBlank()) {
            throw new RuntimeException("Empty SOAP response received from legacy HR system");
        }

        return parseSoapResponse(responseBody);
    }

    private EmployeeInfo parseSoapResponse(String xml) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document doc = builder.parse(new InputSource(new StringReader(xml)));

        String empId = extractTagValue(doc, "employeeId");
        String name = extractTagValue(doc, "name");
        String department = extractTagValue(doc, "department");
        String managerEmail = extractTagValue(doc, "managerEmail");

        return new EmployeeInfo(empId, name, department, managerEmail);
    }

    private String extractTagValue(Document doc, String tagName) {
        NodeList list = doc.getElementsByTagNameNS("*", tagName);
        if (list.getLength() > 0 && list.item(0).getTextContent() != null) {
            return list.item(0).getTextContent().trim();
        }
        NodeList plainList = doc.getElementsByTagName(tagName);
        if (plainList.getLength() > 0 && plainList.item(0).getTextContent() != null) {
            return plainList.item(0).getTextContent().trim();
        }
        return null;
    }
}
