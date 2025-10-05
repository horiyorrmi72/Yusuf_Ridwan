import express from 'express';

import DepartmentController from '../controllers/department.controller';
import EmployeeController from '../controllers/employee.controller';

import DepartmentService from '../services/department.service';
import EmployeeService from '../services/employee.service';

import DepartmentRepo from '../repositories/department.repo';
import EmployeeRepo from '../repositories/employee.repo';

import { sequelize } from '../configs/db';

// models
import { Department } from '../models/department.model';
import { Employee } from '../models/employee.model';
import { LeaveRequest } from '../models/leaveRequest.model';

const router = express.Router();

/* ------DEPENDENCY INJECTION ---------*/

// Instantiating repositories
const departmentRepo = new DepartmentRepo(Department);
const employeeRepo = new EmployeeRepo(Employee, LeaveRequest);

// Instantiating services
const departmentService = new DepartmentService({
    departmentRepo,
    employeeRepo,
    sequelize,
});

const employeeService = new EmployeeService({
    employeeRepo,
    sequelize,
});

// Instantiating controllers
const departmentController = new DepartmentController(departmentService);
const employeeController = new EmployeeController(employeeService);

/* ----------------ROUTES-----------------*/

// Department routes
router.post('/departments', (req, res, next) =>
    departmentController.create(req, res, next)
);

router.get('/departments/:id/employees', (req, res, next) =>
    departmentController.getDepartmentWithEmployees(req, res, next)
);

// Employee routes
router.post('/employees', (req, res, next) =>
    employeeController.create(req, res, next)
);

router.get('/employees/:id', (req, res, next) =>
    employeeController.getEmployeeeAndLeaves(req, res, next)
);

export default router;
