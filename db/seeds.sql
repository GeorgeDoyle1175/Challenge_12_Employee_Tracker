-- Insert departments
INSERT INTO department (name) VALUES ('Sales'), ('Marketing'), ('Engineering');

-- Insert roles
INSERT INTO role (title, salary, department_id) VALUES
  ('Sales Manager', 80000.00, 1),
  ('Sales Representative', 50000.00, 1),
  ('Marketing Manager', 75000.00, 2),
  ('Marketing Coordinator', 40000.00, 2),
  ('Software Engineer', 100000.00, 3),
  ('DevOps Engineer', 90000.00, 3),
  ('Product Manager', 120000.00, 3);

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, 1),
  ('Jane', 'Smith', 2, 1),
  ('Bob', 'Johnson', 3, 1),
  ('Alice', 'Williams', 4, 2),
  ('David', 'Brown', 5, 3),
  ('Sarah', 'Davis', 6, 3),
  ('Mark', 'Miller', 7, 2);
