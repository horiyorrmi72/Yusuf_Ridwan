import DepartmentRepo from '../repositories/department.repo';
import EmployeeRepo from '../repositories/employee.repo';
import { Sequelize, Transaction } from 'sequelize';
import { sequelize } from '../configs/db';

interface IDepartmentServiceDependencies {
    departmentRepo: DepartmentRepo;
    employeeRepo: EmployeeRepo;
    sequelize: Sequelize
}

class DepartmentService {
    private departmentRepo: DepartmentRepo;
    private employeeRepo: EmployeeRepo;
    private sequelize: Sequelize;

    constructor({ departmentRepo, employeeRepo, sequelize }: IDepartmentServiceDependencies) {
        this.departmentRepo = departmentRepo;
        this.employeeRepo = employeeRepo;
        this.sequelize = sequelize;
    }

    /**
     * Create a new department
     */
    async createDepartment(data: any): Promise<{ exists: true } | any> {
        const transaction: Transaction = await this.sequelize.transaction();
        try {
            const existingDepartment = await this.departmentRepo.findByName(data.name);
            if (existingDepartment) {
                return { exists: true }
            }
            const department = await this.departmentRepo.create(data, transaction);
            await transaction.commit();
            return department;
        } catch (err) {
            await transaction.rollback()
            throw err;
        }
    }

    /**
     * Get employees by departmentId (with pagina
     */
    async getEmployeesByDepartmentId(departmentId: number, page = 1, limit = 20): Promise<{ empty: true } | any> {
        const transaction: Transaction = await this.sequelize.transaction();
        try {
            const { count, rows } = await this.employeeRepo.listByDepartment(departmentId, { page, limit });
            if (!rows || rows.length === 0) {
                return { empty: true }
            }
            return {
                employees: rows,
                total: count,
                page,
                limit,
            };
        } catch (err) {
            await transaction.rollback();
            //console.error('Failed to get employees by department:', err);
            throw err;
        }
    }
}

export default DepartmentService;
