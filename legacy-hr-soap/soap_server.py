import xml.etree.ElementTree as ET
from http.server import HTTPServer, BaseHTTPRequestHandler
from typing import Dict

EMPLOYEES: Dict[str, Dict[str, str]] = {
    "E1023": {
        "employeeId": "E1023",
        "name": "Jane Doe",
        "department": "Engineering",
        "managerEmail": "manager@company.com"
    },
    "E1024": {
        "employeeId": "E1024",
        "name": "John Smith",
        "department": "Security",
        "managerEmail": "security.lead@company.com"
    },
    "E1025": {
        "employeeId": "E1025",
        "name": "Alice Wong",
        "department": "Product",
        "managerEmail": "alice.vp@company.com"
    },
    "E1026": {
        "employeeId": "E1026",
        "name": "Bob Miller",
        "department": "HR",
        "managerEmail": "hr.director@company.com"
    },
    "E1027": {
        "employeeId": "E1027",
        "name": "Charlie Patel",
        "department": "IT Support",
        "managerEmail": "it.lead@company.com"
    }
}

WSDL_CONTENT = """<?xml version="1.0" encoding="UTF-8"?>
<definitions name="HrService"
    targetNamespace="http://flowdesk.com/hr"
    xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:tns="http://flowdesk.com/hr"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema">

    <types>
        <xsd:schema targetNamespace="http://flowdesk.com/hr">
            <xsd:element name="getEmployeeInfo">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="employeeId" type="xsd:string"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
            <xsd:element name="getEmployeeInfoResponse">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="employeeId" type="xsd:string"/>
                        <xsd:element name="name" type="xsd:string"/>
                        <xsd:element name="department" type="xsd:string"/>
                        <xsd:element name="managerEmail" type="xsd:string"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
        </xsd:schema>
    </types>

    <message name="getEmployeeInfoRequest">
        <part name="parameters" element="tns:getEmployeeInfo"/>
    </message>
    <message name="getEmployeeInfoResponse">
        <part name="parameters" element="tns:getEmployeeInfoResponse"/>
    </message>

    <portType name="HrPortType">
        <operation name="getEmployeeInfo">
            <input message="tns:getEmployeeInfoRequest"/>
            <output message="tns:getEmployeeInfoResponse"/>
        </operation>
    </portType>

    <binding name="HrBinding" type="tns:HrPortType">
        <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
        <operation name="getEmployeeInfo">
            <soap:operation soapAction="getEmployeeInfo"/>
            <input><soap:body use="literal"/></input>
            <output><soap:body use="literal"/></output>
        </operation>
    </binding>

    <service name="HrService">
        <port name="HrPort" binding="tns:HrBinding">
            <soap:address location="http://localhost:8002/hr"/>
        </port>
    </service>
</definitions>
""".strip()

def build_soap_response(emp: Dict[str, str]) -> str:
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:hr="http://flowdesk.com/hr">
    <soapenv:Header/>
    <soapenv:Body>
        <hr:getEmployeeInfoResponse>
            <hr:employeeId>{emp["employeeId"]}</hr:employeeId>
            <hr:name>{emp["name"]}</hr:name>
            <hr:department>{emp["department"]}</hr:department>
            <hr:managerEmail>{emp["managerEmail"]}</hr:managerEmail>
        </hr:getEmployeeInfoResponse>
    </soapenv:Body>
</soapenv:Envelope>
""".strip()

def build_soap_fault(code: str, message: str) -> str:
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
    <soapenv:Body>
        <soapenv:Fault>
            <faultcode>{code}</faultcode>
            <faultstring>{message}</faultstring>
        </soapenv:Fault>
    </soapenv:Body>
</soapenv:Envelope>
""".strip()

def parse_employee_id(xml_text: str) -> str:
    try:
        root = ET.fromstring(xml_text)
        for elem in root.iter():
            tag_name = elem.tag.split("}")[-1]
            if tag_name == "employeeId" and elem.text:
                return elem.text.strip()
    except Exception:
        pass

    import re
    match = re.search(r"<(?:\w+:)?employeeId>([^<]+)</(?:\w+:)?employeeId>", xml_text)
    if match:
        return match.group(1).strip()
    return ""

class SoapRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/hr?wsdl" or self.path == "/hr/?wsdl" or self.path.startswith("/hr?wsdl"):
            wsdl_bytes = WSDL_CONTENT.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/xml; charset=utf-8")
            self.send_header("Content-Length", str(len(wsdl_bytes)))
            self.end_headers()
            self.wfile.write(wsdl_bytes)
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        post_body = self.rfile.read(content_length).decode("utf-8")
        
        emp_id = parse_employee_id(post_body)
        if not emp_id:
            emp = EMPLOYEES.get("E1023")
        else:
            emp = EMPLOYEES.get(emp_id)

        if not emp:
            emp = {
                "employeeId": emp_id,
                "name": "Unknown Employee",
                "department": "Operations",
                "managerEmail": "admin@company.com"
            }

        response_xml = build_soap_response(emp)
        response_bytes = response_xml.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/xml; charset=utf-8")
        self.send_header("Content-Length", str(len(response_bytes)))
        self.end_headers()
        self.wfile.write(response_bytes)

def run_server(host="0.0.0.0", port=8002):
    server_address = (host, port)
    httpd = HTTPServer(server_address, SoapRequestHandler)
    print(f"Mock SOAP legacy HR service running on http://{host}:{port}/hr?wsdl")
    httpd.serve_forever()

if __name__ == "__main__":
    run_server()
