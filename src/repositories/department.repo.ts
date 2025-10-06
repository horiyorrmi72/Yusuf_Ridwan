import { Transaction } from "sequelize";
import { Department, IDepartmentCreation } from "../models/department.model";



class DepartmentRepo {
    constructor(private DepartmentModel: typeof Department) { }

    async create(data: IDepartmentCreation, tx?: Transaction) {
        return this.DepartmentModel.create(data, { transaction: tx });
    }
    async findById(id: number) {
        return this.DepartmentModel.findByPk(id);
    }
}

export default DepartmentRepo;