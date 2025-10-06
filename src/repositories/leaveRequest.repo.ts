import { Transaction } from "sequelize";
import { LeaveRequest, ILeaveRequestCreation, LeaveStatus } from "../models/leaveRequest.model";

interface PaginationOptions {
    page?: number;
    limit?: number;
}

class LeaveRequestRepo {
    constructor(private LeaveRequestModel: typeof LeaveRequest) { }

    async create(data: ILeaveRequestCreation, tx?: Transaction) {
        return this.LeaveRequestModel.create(data, { transaction: tx });
    }

    async findByIdWithEmployee(id: number) {
        return this.LeaveRequestModel.findByPk(id, {
            include: ["Employee"],
        });
    }

    async updateStatus(id: number, status: LeaveStatus, tx?: Transaction) {
        return this.LeaveRequestModel.update(
            { status },
            { where: { id }, transaction: tx }
        );
    }

    async listByEmployee(
        employeeId: number,
        { page = 1, limit = 20 }: PaginationOptions
    ) {
        return this.LeaveRequestModel.findAndCountAll({
            where: { employeeId },
            limit,
            offset: (page - 1) * limit,
            order: [["createdAt", "DESC"]],
        });
    }
}

export default LeaveRequestRepo;
