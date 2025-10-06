import LeaveRequestRepo from '../repositories/leaveRequest.repo';
import { sequelize } from '../configs/db';
import { Sequelize, Transaction } from "sequelize";
import Producer from '../queue/producer';
import { ILeaveRequestCreation } from '../models/leaveRequest.model';
import { configVariables } from '../configs';



interface ILeaveRequest {
    leaveRequestRepo: LeaveRequestRepo;
    producer: Producer;
    sequelize: Sequelize;
}


class LeaveRequestService {
    private leaveRequestRepo: LeaveRequestRepo;
    private producer: Producer;
    private sequelize: Sequelize;

    constructor({ leaveRequestRepo, producer, sequelize }: ILeaveRequest) {
        this.leaveRequestRepo = leaveRequestRepo;
        this.producer = new Producer(configVariables.rabbit.url);
        this.sequelize = sequelize;
    }

    private calculateDays(startDate: Date, endDate: Date): number {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffMs = end.getTime() - start.getTime();
        return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }

    async createLeave({ employeeId, startDate, endDate }: ILeaveRequestCreation) {
        const transaction: Transaction = await this.sequelize.transaction();
        try {
            const leaveRequest = await this.leaveRequestRepo.create({
                employeeId,
                startDate,
                endDate,
                status: 'PENDING',
            },
                transaction
            );

            const days = this.calculateDays(
                new Date(startDate),
                new Date(endDate)
            );

            await this.producer.publish('leave.requested', {
                leaveId: leaveRequest.id,
                employeeId: leaveRequest.employeeId,
                days,
                createdAt: leaveRequest.createdAt,
            });
            await transaction.commit();
            return leaveRequest;



        } catch (err) {
            await transaction.rollback();
            throw err;

        }
    }

}

export default LeaveRequestService;