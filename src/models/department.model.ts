import { DataTypes, Model, Sequelize, Optional } from "sequelize";

interface IDepartmentData {
    id: number;
    name: string;
    createdAt: Date;
}

export interface IDepartmentCreation extends Optional<IDepartmentData, "id" | "createdAt"> { }
export class Department extends Model<IDepartmentData, IDepartmentCreation>
    implements IDepartmentData {
    public id!: number;
    public name!: string;
    public createdAt!: Date;

    static associate(models: any) {
        Department.hasMany(models.Employee, { foreignKey: "departmentId" });
    }
}

export default (sequelize: Sequelize) => {
    Department.init(
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
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
        },
        {
            sequelize,
            tableName: "departments",
            timestamps: false,
        }
    );

    return Department;
};
