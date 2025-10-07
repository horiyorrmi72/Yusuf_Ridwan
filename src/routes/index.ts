import express from 'express';

import DepartmentController from '../controllers/department.controller';
import EmployeeController from '../controllers/employee.controller';
import LeaveRequestController from '../controllers/leaveRequest.controller';

import DepartmentService from '../services/department.service';
import EmployeeService from '../services/employee.service';
import LeaveRequestService from '../services/leaveRequest.service';

import DepartmentRepo from '../repositories/department.repo';
import EmployeeRepo from '../repositories/employee.repo';
import LeaveRequestRepo from '../repositories/leaveRequest.repo';

import { sequelize } from '../configs/db';
import { configVariables } from '../configs';

// models
import { Department } from '../models/department.model';
import { Employee } from '../models/employee.model';
import { LeaveRequest } from '../models/leaveRequest.model';

import models from '../models';

import Producer from '../queue/producer';


const router = express.Router();

/* ------DEPENDENCY INJECTION ---------*/

const producer = new Producer(configVariables.rabbit.url);

// Instantiating repositories
const departmentRepo = new DepartmentRepo(models.Department);
const employeeRepo = new EmployeeRepo(models.Employee, models.LeaveRequest);
const leaveRequestRepo = new LeaveRequestRepo(models.LeaveRequest)

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

const leaveRequestService = new LeaveRequestService({
    leaveRequestRepo,
    producer,
    sequelize,
})

// Instantiating controllers
const departmentController = new DepartmentController(departmentService);
const employeeController = new EmployeeController(employeeService);
const leaveRequestController = new LeaveRequestController(leaveRequestService)

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

router.post('/leave-requests', (req, res, next) =>
    leaveRequestController.create(req, res, next)
);
export default router;
