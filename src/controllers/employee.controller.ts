import { NextFunction, Request, Response } from "express";
import EmployeeService from "../services/employee.service"



class EmpoloyeeController {

    private service: EmployeeService;

    constructor(service: EmployeeService) {
        this.service = service;
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const employee = await this.service.createEmployee(req.body);
            res.success(employee, { message: 'Employee created successfully' })
        } catch (err) {
            next(err);
        }
    }

    async getEmployeeeAndLeaves(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (!id) {
                console.log('Id is needed');
            }
            const employeeWithLeaves = await this.service.getanEmployeeWithLeaveHistory(id)

            res.success(employeeWithLeaves, { message: 'Employee with leave history fetched.' })

        } catch (err) {
            next(err)

        }
    }

}

export default EmpoloyeeController;