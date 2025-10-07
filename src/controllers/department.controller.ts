
import { NextFunction, Request, Response } from "express";
import DepartmentService from "../services/department.service";

class DepartmentController {
    private service: DepartmentService;

    constructor(service: DepartmentService) {
        this.service = service;
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const department = await this.service.createDepartment(req.body);
            if ('exists' in department && department.exists) {
                return res.fail('Department already exists', 409);
            }
            const resPayload = { "departmentName": department.name, id: department.id }
            res.success({ resPayload }, {
                message: 'Department Created Successfully.',
                createdAt: department.createdAt,
            }, 201)

        } catch (err) {
            next(err)
        }
    }

    async getDepartmentWithEmployees(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 20;

            const department = await this.service.getEmployeesByDepartmentId(id, page, limit);
            res.success({ departmentId: id, employees: department.employees }, {
                total: department.total,
                page: department.page,
                limit: department.limit

            });

        } catch (err) {
            next(err);
        }
    }
}

export default DepartmentController;