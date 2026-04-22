#!/usr/bin/env python3
"""
HR Dashboard Backend API Test Suite
Tests all endpoints with proper authentication and role-based access control
"""

import requests
import json
import sys
from typing import Dict, Optional

# Base URL from frontend/.env
BASE_URL = "https://hr-management-ui-1.preview.emergentagent.com/api"

# Demo accounts from seed.py
DEMO_ACCOUNTS = {
    "superadmin": {
        "email": "superadmin@demo.com",
        "password": "Demo@123",
        "role": "super_admin",
        "name": "Alex Morgan"
    },
    "admin": {
        "email": "admin@acme.com", 
        "password": "Demo@123",
        "role": "tenant_admin",
        "name": "Pristia Candra",
        "tenant": "Acme Corp"
    },
    "employee": {
        "email": "employee@acme.com",
        "password": "Demo@123", 
        "role": "employee",
        "name": "Hanna Baptista",
        "tenant": "Acme Corp"
    }
}

class APITester:
    def __init__(self):
        self.tokens = {}
        self.test_results = []
        self.failed_tests = []
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = f"{status}: {test_name}"
        if details:
            result += f" - {details}"
        print(result)
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details
        })
        
        if not success:
            self.failed_tests.append(test_name)
    
    def make_request(self, method: str, endpoint: str, token: Optional[str] = None, 
                    data: Optional[Dict] = None, params: Optional[Dict] = None) -> requests.Response:
        """Make HTTP request with optional authentication"""
        url = f"{BASE_URL}{endpoint}"
        headers = {"Content-Type": "application/json"}
        
        if token:
            headers["Authorization"] = f"Bearer {token}"
            
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=headers, params=params, timeout=30)
            elif method.upper() == "POST":
                response = requests.post(url, headers=headers, json=data, timeout=30)
            elif method.upper() == "PATCH":
                response = requests.patch(url, headers=headers, json=data, params=params, timeout=30)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=headers, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            raise
    
    def test_auth_login(self):
        """Test 1-4: Authentication endpoints"""
        print("\n=== AUTHENTICATION TESTS ===")
        
        # Test 1: Login with each demo account
        for account_type, account in DEMO_ACCOUNTS.items():
            response = self.make_request("POST", "/auth/login", data={
                "email": account["email"],
                "password": account["password"]
            })
            
            if response.status_code == 200:
                data = response.json()
                if "token" in data and "user" in data:
                    self.tokens[account_type] = data["token"]
                    user = data["user"]
                    
                    # Verify user object has correct fields
                    expected_fields = ["id", "email", "role", "name", "permissions"]
                    missing_fields = [f for f in expected_fields if f not in user]
                    
                    if not missing_fields and user["role"] == account["role"]:
                        self.log_test(f"Login {account_type} ({account['email']})", True, 
                                    f"Role: {user['role']}, Permissions: {len(user.get('permissions', []))}")
                    else:
                        self.log_test(f"Login {account_type} ({account['email']})", False, 
                                    f"Missing fields: {missing_fields} or wrong role")
                else:
                    self.log_test(f"Login {account_type} ({account['email']})", False, 
                                "Missing token or user in response")
            else:
                self.log_test(f"Login {account_type} ({account['email']})", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
        
        # Test 2: Login with wrong password
        response = self.make_request("POST", "/auth/login", data={
            "email": "superadmin@demo.com",
            "password": "WrongPassword"
        })
        
        success = response.status_code == 401
        self.log_test("Login with wrong password", success, 
                     f"Expected 401, got {response.status_code}")
        
        # Test 3: Get current user with valid token
        if "superadmin" in self.tokens:
            response = self.make_request("GET", "/auth/me", token=self.tokens["superadmin"])
            success = response.status_code == 200 and "email" in response.json()
            self.log_test("GET /auth/me with valid token", success,
                         f"Status: {response.status_code}")
        
        # Test 4: Get current user without token
        response = self.make_request("GET", "/auth/me")
        success = response.status_code == 401
        self.log_test("GET /auth/me without token", success,
                     f"Expected 401, got {response.status_code}")
    
    def test_tenants(self):
        """Test 5-7: Tenant management"""
        print("\n=== TENANT MANAGEMENT TESTS ===")
        
        # Test 5: GET /tenants as superadmin
        if "superadmin" in self.tokens:
            response = self.make_request("GET", "/tenants", token=self.tokens["superadmin"])
            if response.status_code == 200:
                tenants = response.json()
                expected_tenants = ["Acme Corp", "Unpixel Studio", "Stellar Labs"]
                tenant_names = [t.get("name") for t in tenants]
                
                success = len(tenants) >= 3 and all(name in tenant_names for name in expected_tenants)
                self.log_test("GET /tenants as superadmin", success,
                             f"Found {len(tenants)} tenants: {tenant_names}")
            else:
                self.log_test("GET /tenants as superadmin", False,
                             f"Status: {response.status_code}")
        
        # Test 6: GET /tenants as tenant_admin (should fail)
        if "admin" in self.tokens:
            response = self.make_request("GET", "/tenants", token=self.tokens["admin"])
            success = response.status_code == 403
            self.log_test("GET /tenants as tenant_admin", success,
                         f"Expected 403, got {response.status_code}")
        
        # Test 7: POST and DELETE tenant as superadmin
        if "superadmin" in self.tokens:
            # Create tenant
            test_tenant = {
                "name": "Test Company",
                "slug": "test-company",
                "plan": "Pro"
            }
            
            response = self.make_request("POST", "/tenants", 
                                       token=self.tokens["superadmin"], data=test_tenant)
            
            if response.status_code == 200:
                created_tenant = response.json()
                tenant_id = created_tenant.get("id")
                
                self.log_test("POST /tenants as superadmin", True,
                             f"Created tenant: {created_tenant.get('name')}")
                
                # Delete the created tenant
                if tenant_id:
                    delete_response = self.make_request("DELETE", f"/tenants/{tenant_id}",
                                                      token=self.tokens["superadmin"])
                    success = delete_response.status_code == 200
                    self.log_test("DELETE /tenants/{id} as superadmin", success,
                                 f"Status: {delete_response.status_code}")
            else:
                self.log_test("POST /tenants as superadmin", False,
                             f"Status: {response.status_code}, Response: {response.text}")
    
    def test_employees(self):
        """Test 8-16: Employee management"""
        print("\n=== EMPLOYEE MANAGEMENT TESTS ===")
        
        # Test 8: GET /employees as tenant_admin
        if "admin" in self.tokens:
            response = self.make_request("GET", "/employees", token=self.tokens["admin"])
            if response.status_code == 200:
                employees = response.json()
                success = len(employees) >= 8  # Should have ~10 Acme employees
                self.log_test("GET /employees as tenant_admin", success,
                             f"Found {len(employees)} Acme employees")
            else:
                self.log_test("GET /employees as tenant_admin", False,
                             f"Status: {response.status_code}")
        
        # Test 9: GET /employees as super_admin
        if "superadmin" in self.tokens:
            response = self.make_request("GET", "/employees", token=self.tokens["superadmin"])
            if response.status_code == 200:
                employees = response.json()
                success = len(employees) >= 15  # Should have all employees across tenants
                self.log_test("GET /employees as super_admin", success,
                             f"Found {len(employees)} total employees")
            else:
                self.log_test("GET /employees as super_admin", False,
                             f"Status: {response.status_code}")
        
        # Test 10: GET /employees as employee (should see only self)
        if "employee" in self.tokens:
            response = self.make_request("GET", "/employees", token=self.tokens["employee"])
            if response.status_code == 200:
                employees = response.json()
                # Employee should see only their own record (Hanna Baptista with user_id matching their login)
                success = (len(employees) == 1 and 
                          employees[0].get("user_id") == "user-emp-acme" and
                          employees[0].get("first_name") == "Hanna")
                self.log_test("GET /employees as employee", success,
                             f"Found {len(employees)} employee(s) - {employees[0].get('first_name')} {employees[0].get('last_name')}")
            else:
                self.log_test("GET /employees as employee", False,
                             f"Status: {response.status_code}")
        
        # Test 11: Search employees
        if "admin" in self.tokens:
            response = self.make_request("GET", "/employees", 
                                       token=self.tokens["admin"], 
                                       params={"search": "Pristia"})
            if response.status_code == 200:
                employees = response.json()
                success = len(employees) >= 1 and any("Pristia" in emp.get("first_name", "") for emp in employees)
                self.log_test("GET /employees?search=Pristia", success,
                             f"Found {len(employees)} matching employees")
            else:
                self.log_test("GET /employees?search=Pristia", False,
                             f"Status: {response.status_code}")
        
        # Test 12: Filter by status
        if "admin" in self.tokens:
            response = self.make_request("GET", "/employees", 
                                       token=self.tokens["admin"], 
                                       params={"status": "Active"})
            if response.status_code == 200:
                employees = response.json()
                active_employees = [emp for emp in employees if emp.get("status") == "Active"]
                success = len(active_employees) >= 1
                self.log_test("GET /employees?status=Active", success,
                             f"Found {len(active_employees)} active employees")
            else:
                self.log_test("GET /employees?status=Active", False,
                             f"Status: {response.status_code}")
        
        # Test 13: POST /employees as admin
        if "admin" in self.tokens:
            new_employee = {
                "first_name": "Test",
                "last_name": "Employee",
                "email": "test.employee@acme.com",
                "title": "Test Engineer"
            }
            
            response = self.make_request("POST", "/employees", 
                                       token=self.tokens["admin"], data=new_employee)
            
            if response.status_code == 200:
                created_emp = response.json()
                emp_id = created_emp.get("id")
                self.log_test("POST /employees as admin", True,
                             f"Created employee: {created_emp.get('first_name')} {created_emp.get('last_name')}")
                
                # Test 14: PATCH /employees/{id} as admin
                if emp_id:
                    update_data = {"title": "Senior Test Engineer"}
                    patch_response = self.make_request("PATCH", f"/employees/{emp_id}",
                                                     token=self.tokens["admin"], data=update_data)
                    success = patch_response.status_code == 200
                    self.log_test("PATCH /employees/{id} as admin", success,
                                 f"Status: {patch_response.status_code}")
                    
                    # Test 15: DELETE /employees/{id} as admin
                    delete_response = self.make_request("DELETE", f"/employees/{emp_id}",
                                                      token=self.tokens["admin"])
                    success = delete_response.status_code == 200
                    self.log_test("DELETE /employees/{id} as admin", success,
                                 f"Status: {delete_response.status_code}")
            else:
                self.log_test("POST /employees as admin", False,
                             f"Status: {response.status_code}, Response: {response.text}")
        
        # Test 16: POST /employees as employee (should fail)
        if "employee" in self.tokens:
            new_employee = {
                "first_name": "Unauthorized",
                "last_name": "Employee",
                "email": "unauthorized@acme.com",
                "title": "Hacker"
            }
            
            response = self.make_request("POST", "/employees", 
                                       token=self.tokens["employee"], data=new_employee)
            success = response.status_code == 403
            self.log_test("POST /employees as employee", success,
                         f"Expected 403, got {response.status_code}")
    
    def test_roles_permissions(self):
        """Test 17-21: Roles and permissions"""
        print("\n=== ROLES & PERMISSIONS TESTS ===")
        
        # Test 17: GET /roles as tenant_admin
        if "admin" in self.tokens:
            response = self.make_request("GET", "/roles", token=self.tokens["admin"])
            if response.status_code == 200:
                roles = response.json()
                role_names = [r.get("name") for r in roles]
                # Should see system roles + HR Manager custom role
                success = len(roles) >= 4 and "HR Manager" in role_names
                self.log_test("GET /roles as tenant_admin", success,
                             f"Found {len(roles)} roles: {role_names}")
            else:
                self.log_test("GET /roles as tenant_admin", False,
                             f"Status: {response.status_code}")
        
        # Test 18: GET /permissions
        if "admin" in self.tokens:
            response = self.make_request("GET", "/permissions", token=self.tokens["admin"])
            if response.status_code == 200:
                permissions = response.json()
                success = len(permissions) >= 10 and all("key" in p for p in permissions)
                self.log_test("GET /permissions", success,
                             f"Found {len(permissions)} permissions")
            else:
                self.log_test("GET /permissions", False,
                             f"Status: {response.status_code}")
        
        # Test 19: POST /roles as tenant_admin
        if "admin" in self.tokens:
            new_role = {
                "name": "Test Manager",
                "description": "Test role for API testing",
                "permissions": ["employees.read", "employees.update"]
            }
            
            response = self.make_request("POST", "/roles", 
                                       token=self.tokens["admin"], data=new_role)
            
            if response.status_code == 200:
                created_role = response.json()
                role_id = created_role.get("id")
                self.log_test("POST /roles as tenant_admin", True,
                             f"Created role: {created_role.get('name')}")
                
                # Test 20: PATCH /roles/{id} to update permissions
                if role_id:
                    update_data = {"permissions": ["employees.read", "employees.update", "reports.read"]}
                    patch_response = self.make_request("PATCH", f"/roles/{role_id}",
                                                     token=self.tokens["admin"], data=update_data)
                    success = patch_response.status_code == 200
                    self.log_test("PATCH /roles/{id} permissions", success,
                                 f"Status: {patch_response.status_code}")
                    
                    # Test 21: DELETE /roles/{id} for custom role
                    delete_response = self.make_request("DELETE", f"/roles/{role_id}",
                                                      token=self.tokens["admin"])
                    success = delete_response.status_code == 200
                    self.log_test("DELETE /roles/{id} custom role", success,
                                 f"Status: {delete_response.status_code}")
            else:
                self.log_test("POST /roles as tenant_admin", False,
                             f"Status: {response.status_code}, Response: {response.text}")
    
    def test_time_off(self):
        """Test 22-25: Time-off management"""
        print("\n=== TIME-OFF MANAGEMENT TESTS ===")
        
        # Test 22: GET /time-off as tenant_admin
        if "admin" in self.tokens:
            response = self.make_request("GET", "/time-off", token=self.tokens["admin"])
            if response.status_code == 200:
                requests_list = response.json()
                success = len(requests_list) >= 4  # Should have seeded requests
                self.log_test("GET /time-off as tenant_admin", success,
                             f"Found {len(requests_list)} time-off requests")
            else:
                self.log_test("GET /time-off as tenant_admin", False,
                             f"Status: {response.status_code}")
        
        # Test 23: GET /time-off as employee (should see only own)
        if "employee" in self.tokens:
            response = self.make_request("GET", "/time-off", token=self.tokens["employee"])
            if response.status_code == 200:
                requests_list = response.json()
                # Employee should see only their own requests (Hanna Baptista)
                success = all(req.get("employee_name") == "Hanna Baptista" for req in requests_list)
                self.log_test("GET /time-off as employee", success,
                             f"Found {len(requests_list)} own requests")
            else:
                self.log_test("GET /time-off as employee", False,
                             f"Status: {response.status_code}")
        
        # Test 24: POST /time-off as employee
        if "employee" in self.tokens:
            new_request = {
                "type": "Annual Leave",
                "start_date": "15 Dec 2024",
                "end_date": "17 Dec 2024",
                "days": 3,
                "reason": "API Test vacation"
            }
            
            response = self.make_request("POST", "/time-off", 
                                       token=self.tokens["employee"], data=new_request)
            
            if response.status_code == 200:
                created_request = response.json()
                request_id = created_request.get("id")
                self.log_test("POST /time-off as employee", True,
                             f"Created request: {created_request.get('type')} for {created_request.get('days')} days")
                
                # Test 25: PATCH /time-off/{id}?status=Approved as admin
                if request_id and "admin" in self.tokens:
                    patch_response = self.make_request("PATCH", f"/time-off/{request_id}",
                                                     token=self.tokens["admin"], 
                                                     params={"status": "Approved"})
                    success = patch_response.status_code == 200
                    self.log_test("PATCH /time-off/{id}?status=Approved as admin", success,
                                 f"Status: {patch_response.status_code}")
            else:
                self.log_test("POST /time-off as employee", False,
                             f"Status: {response.status_code}, Response: {response.text}")
    
    def test_stats(self):
        """Test 26: Stats endpoint for each role"""
        print("\n=== STATS TESTS ===")
        
        for account_type, account in DEMO_ACCOUNTS.items():
            if account_type in self.tokens:
                response = self.make_request("GET", "/stats", token=self.tokens[account_type])
                
                if response.status_code == 200:
                    stats = response.json()
                    scope = stats.get("scope")
                    stats_data = stats.get("stats", [])
                    
                    expected_scopes = {
                        "superadmin": "platform",
                        "admin": "tenant", 
                        "employee": "self"
                    }
                    
                    success = (scope == expected_scopes.get(account_type) and 
                             len(stats_data) >= 4)
                    self.log_test(f"GET /stats as {account_type}", success,
                                 f"Scope: {scope}, Stats count: {len(stats_data)}")
                else:
                    self.log_test(f"GET /stats as {account_type}", False,
                                 f"Status: {response.status_code}")
    
    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting HR Dashboard Backend API Tests")
        print(f"Base URL: {BASE_URL}")
        
        try:
            self.test_auth_login()
            self.test_tenants()
            self.test_employees()
            self.test_roles_permissions()
            self.test_time_off()
            self.test_stats()
            
        except Exception as e:
            print(f"\n❌ Test execution failed: {e}")
            return False
        
        # Summary
        total_tests = len(self.test_results)
        passed_tests = len([t for t in self.test_results if t["success"]])
        failed_tests = total_tests - passed_tests
        
        print(f"\n📊 TEST SUMMARY")
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"  - {test}")
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = APITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)