// Mock data service for demo purposes when PostgreSQL is not available
const mockTables = {
  employees: {
    columns: ['id', 'name', 'department_id', 'salary', 'hire_date', 'email'],
    rows: [
      { id: 1, name: 'John Doe', department_id: 1, salary: 75000, hire_date: '2022-01-15', email: 'john.doe@company.com' },
      { id: 2, name: 'Jane Smith', department_id: 1, salary: 82000, hire_date: '2021-03-20', email: 'jane.smith@company.com' },
      { id: 3, name: 'Mike Johnson', department_id: 2, salary: 65000, hire_date: '2022-06-10', email: 'mike.johnson@company.com' },
      { id: 4, name: 'Sarah Wilson', department_id: 2, salary: 58000, hire_date: '2023-02-28', email: 'sarah.wilson@company.com' },
      { id: 5, name: 'David Brown', department_id: 3, salary: 72000, hire_date: '2021-11-05', email: 'david.brown@company.com' },
      { id: 6, name: 'Lisa Davis', department_id: 3, salary: 68000, hire_date: '2022-09-12', email: 'lisa.davis@company.com' },
      { id: 7, name: 'Tom Miller', department_id: 1, salary: 95000, hire_date: '2020-07-18', email: 'tom.miller@company.com' },
      { id: 8, name: 'Amy Taylor', department_id: 4, salary: 55000, hire_date: '2023-01-30', email: 'amy.taylor@company.com' },
      { id: 9, name: 'Chris Anderson', department_id: 1, salary: 78000, hire_date: '2022-04-25', email: 'chris.anderson@company.com' },
      { id: 10, name: 'Emma White', department_id: 2, salary: 62000, hire_date: '2023-03-15', email: 'emma.white@company.com' }
    ]
  },
  departments: {
    columns: ['id', 'name', 'location'],
    rows: [
      { id: 1, name: 'Engineering', location: 'San Francisco' },
      { id: 2, name: 'Marketing', location: 'New York' },
      { id: 3, name: 'Sales', location: 'Chicago' },
      { id: 4, name: 'HR', location: 'Austin' }
    ]
  }
};

// Simple SQL parser for demo queries
const parseSimpleSQL = (query) => {
  const normalizedQuery = query.trim().toLowerCase();
  
  // Basic SELECT * FROM table
  const selectAllMatch = normalizedQuery.match(/select\s+\*\s+from\s+(\w+)(?:\s+where\s+(.+))?/);
  if (selectAllMatch) {
    const tableName = selectAllMatch[1];
    const whereClause = selectAllMatch[2];
    
    if (!mockTables[tableName]) {
      throw new Error(`Table '${tableName}' doesn't exist`);
    }
    
    let rows = mockTables[tableName].rows;
    
    // Simple WHERE clause parsing for salary comparisons
    if (whereClause) {
      const salaryMatch = whereClause.match(/salary\s*>\s*(\d+)/);
      if (salaryMatch) {
        const minSalary = parseInt(salaryMatch[1]);
        rows = rows.filter(row => row.salary > minSalary);
      }
    }
    
    return {
      columns: mockTables[tableName].columns,
      rows: rows,
      rowCount: rows.length
    };
  }
  
  // Basic JOIN query
  const joinMatch = normalizedQuery.match(/select\s+(.+)\s+from\s+(\w+)\s+(\w+)\s+join\s+(\w+)\s+(\w+)\s+on\s+(.+)/);
  if (joinMatch) {
    const selectFields = joinMatch[1];
    const table1 = joinMatch[2];
    const alias1 = joinMatch[3];
    const table2 = joinMatch[4];
    const alias2 = joinMatch[5];
    
    if (!mockTables[table1] || !mockTables[table2]) {
      throw new Error(`One or more tables don't exist`);
    }
    
    // Simple join for employees and departments
    if ((table1 === 'employees' && table2 === 'departments') || 
        (table1 === 'departments' && table2 === 'employees')) {
      
      const employees = mockTables.employees.rows;
      const departments = mockTables.departments.rows;
      
      const joinedRows = employees.map(emp => {
        const dept = departments.find(d => d.id === emp.department_id);
        return {
          name: emp.name,
          department_name: dept ? dept.name : null
        };
      });
      
      return {
        columns: ['name', 'department_name'],
        rows: joinedRows,
        rowCount: joinedRows.length
      };
    }
  }
  
  // Aggregate query example
  const aggregateMatch = normalizedQuery.match(/select\s+.*avg\(.*salary.*\).*group\s+by/);
  if (aggregateMatch) {
    const employees = mockTables.employees.rows;
    const departments = mockTables.departments.rows;
    
    const deptStats = {};
    
    employees.forEach(emp => {
      const dept = departments.find(d => d.id === emp.department_id);
      if (dept) {
        if (!deptStats[dept.name]) {
          deptStats[dept.name] = { salaries: [], count: 0 };
        }
        deptStats[dept.name].salaries.push(emp.salary);
        deptStats[dept.name].count++;
      }
    });
    
    const results = Object.entries(deptStats)
      .filter(([_, stats]) => stats.count > 2) // HAVING COUNT > 2
      .map(([deptName, stats]) => ({
        department: deptName,
        employee_count: stats.count,
        average_salary: Math.round(stats.salaries.reduce((a, b) => a + b, 0) / stats.count)
      }));
    
    return {
      columns: ['department', 'employee_count', 'average_salary'],
      rows: results,
      rowCount: results.length
    };
  }
  
  throw new Error('Query not supported in demo mode. Try: SELECT * FROM employees WHERE salary > 50000');
};

module.exports = {
  mockTables,
  parseSimpleSQL
};