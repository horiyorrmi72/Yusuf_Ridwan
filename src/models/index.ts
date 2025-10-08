import { sequelize } from '../configs/db';
import departmentModelInit from './department.model';
import employeeModelInit from './employee.model';
import leaveRequestModelInit from './leaveRequest.model';
import userModelInit from './user.model'
import processsedMessageInit from './processsedMessage.model';

// Initialize models
const Department = departmentModelInit(sequelize);
const Employee = employeeModelInit(sequelize);
const LeaveRequest = leaveRequestModelInit(sequelize);
const ProcessedMessages = processsedMessageInit(sequelize);
const User = userModelInit(sequelize);

// Setup associations
Department.hasMany(Employee, { foreignKey: 'departmentId' });
Employee.belongsTo(Department, { foreignKey: 'departmentId' });

User.hasOne(Employee, { foreignKey: "email", sourceKey: "email", as: "employeeProfile" });
Employee.belongsTo(User, { foreignKey: "email", targetKey: "email", as: "account" });


Employee.hasMany(LeaveRequest, { foreignKey: 'employeeId' });
LeaveRequest.belongsTo(Employee, { foreignKey: 'employeeId' });

// Export models
export const models = { Department, Employee, LeaveRequest, ProcessedMessages, User }
export default models;
