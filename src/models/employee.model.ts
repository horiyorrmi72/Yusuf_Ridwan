import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface IEmployeeData {
    id: number;
    name: string;
    email: string;
    departmentId: number;
    createdAt: Date;
}

interface IEmployeeCreation
    extends Optional<IEmployeeData, "id" | "createdAt"> { }

export class Employee
    extends Model<IEmployeeData, IEmployeeCreation>
    implements IEmployeeData {
    public id!: number;
    public name!: string;
    public email!: string;
    public departmentId!: number;
    public createdAt!: Date;

    static associate(models: any) {
        Employee.belongsTo(models.Department, { foreignKey: "departmentId" });
        Employee.hasMany(models.LeaveRequest, { foreignKey: "employeeId" });
    }
}

export default (sequelize: Sequelize) => {
    Employee.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            departmentId: {
                type: DataTypes.BIGINT.UNSIGNED,
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
            tableName: "employees",
            timestamps: false,
        }
    );

    return Employee;
};
