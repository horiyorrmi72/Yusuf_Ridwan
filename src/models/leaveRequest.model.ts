import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

interface ILeaveRequestData {
    id: number;
    employeeId: number;
    startDate: string;
    endDate: string;
    status: LeaveStatus;
    createdAt: Date;
}

export interface ILeaveRequestCreation
    extends Optional<ILeaveRequestData, "id" | "createdAt"> { }

export class LeaveRequest
    extends Model<ILeaveRequestData, ILeaveRequestCreation>
    implements ILeaveRequestData {
    public id!: number;
    public employeeId!: number;
    public startDate!: string;
    public endDate!: string;
    public status!: LeaveStatus;
    public createdAt!: Date;

    static associate(models: any) {
        LeaveRequest.belongsTo(models.Employee, { foreignKey: "employeeId" });
    }
}

export default (sequelize: Sequelize) => {
    LeaveRequest.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            employeeId: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            startDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            endDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            tableName: "leave_requests",
            timestamps: false,
        }
    );

    return LeaveRequest;
};
