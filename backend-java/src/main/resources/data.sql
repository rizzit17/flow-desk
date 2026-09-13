MERGE INTO users (employee_id, name, department, manager_email) KEY(employee_id) VALUES
('E1023', 'Jane Doe', 'Engineering', 'manager@company.com'),
('E1024', 'John Smith', 'Security', 'security.lead@company.com'),
('E1025', 'Alice Wong', 'Product', 'alice.vp@company.com'),
('E1026', 'Bob Miller', 'HR', 'hr.director@company.com'),
('E1027', 'Charlie Patel', 'IT Support', 'it.lead@company.com');
