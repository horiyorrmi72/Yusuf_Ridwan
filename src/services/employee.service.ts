import EmployeeRepo from '../repositories/employee.repo';
import { Sequelize, Transaction } from 'sequelize';
import { sequelize } from '../configs/db';

interface IEmployeeServiceDependencies {
    employeeRepo: EmployeeRepo;
    sequelize: Sequelize;
}

class EmployeeService {
    private employeeRepo: EmployeeRepo;
    private sequelize: Sequelize;

    constructor({ employeeRepo, sequelize }: IEmployeeServiceDependencies) {
        this.employeeRepo = employeeRepo;
        this.sequelize = sequelize;
    }

    /**
     * Create an employee under a department.
     */
    async createEmployee(data: any): Promise<{ exists: true } | any> {
        const transaction: Transaction = await this.sequelize.transaction();
        try {
            const existingEmployee = await this.employeeRepo.existsByField('email', data.email);
            if (existingEmployee) {
                return { exists: true };
            }
            const employee = await this.employeeRepo.create(data, transaction);
            await transaction.commit();
            return employee;
        } catch (err) {
            await transaction.rollback()
            throw err;
        }
    }

    /**
     *  Get an employee by id with their leave history
     */
    async getanEmployeeWithLeaveHistory(data: any) {
        const transaction: Transaction = await this.sequelize.transaction();
        try {
            const { id } = data
            const employee = await this.employeeRepo.findByIdWithLeaves(id);
            if (!employee) {
                throw new Error(`Employee with ID ${id} not found`);
            }
            return employee;

        } catch (err) {
            throw err;

        }
    }
}

export default EmployeeService