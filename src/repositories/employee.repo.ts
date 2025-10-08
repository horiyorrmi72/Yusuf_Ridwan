import { Transaction, FindAndCountOptions } from 'sequelize';
import { Employee } from '../models/employee.model';
import { LeaveRequest } from '../models/leaveRequest.model';

interface PaginationOptions {
    page?: number;
    limit?: number;
}

class EmployeeRepo {
    private EmployeeModel: typeof Employee;
    private LeaveRequestModel: typeof LeaveRequest;

    constructor(EmployeeModel: typeof Employee, LeaveRequestModel: typeof LeaveRequest) {
        this.EmployeeModel = EmployeeModel;
        this.LeaveRequestModel = LeaveRequestModel;
    }

    /**
     * Create a new employee
     */
    async create(
        data: { name: string; email: string; departmentId: number },
        transaction?: Transaction
    ): Promise<Employee> {
        return this.EmployeeModel.create(data, { transaction });
    }

    /**
     * Find an employee by primary key
     */
    async findById(id: number): Promise<Employee | null> {
        return this.EmployeeModel.findByPk(id);
    }

    /**
     * Find an employee and include their leave requests
     */
    async findByIdWithLeaves(id: number): Promise<Employee | null> {
        return this.EmployeeModel.findByPk(id, {
            include: [
                {
                    model: this.LeaveRequestModel,
                    as: 'LeaveRequests',
                    order: [['createdAt', 'DESC']],
                },
            ],
        });
    }

    /**find employee by unique data other than id */
    async existsByField(field: string, value: string | number): Promise<boolean> {
        const count = await this.EmployeeModel.count({
            where: { [field]: value },
        });
        return count > 0;
    }



    /**
     * List employees by department
     */
    async listByDepartment(
        departmentId: number,
        options: PaginationOptions = {}
    ): Promise<{ count: number; rows: Employee[] }> {
        const { page = 1, limit = 20 } = options;
        const offset = (page - 1) * limit;

        const query: FindAndCountOptions = {
            where: { departmentId },
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        };

        return this.EmployeeModel.findAndCountAll(query);
    }

    /**
     * Update an employee record
     */
    async update(
        id: number,
        updates: Partial<{ name: string; email: string }>,
        transaction?: Transaction
    ): Promise<[number]> {
        return this.EmployeeModel.update(updates, { where: { id }, transaction });
    }

    /**
     * Delete an employee
     */
    async delete(id: number, transaction?: Transaction): Promise<number> {
        return this.EmployeeModel.destroy({ where: { id }, transaction });
    }
}

export default EmployeeRepo;
