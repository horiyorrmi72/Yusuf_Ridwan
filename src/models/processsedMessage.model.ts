import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface IProcessedMessageData {
    id: number;
    messageId: string;
    processedAt: Date;
}

export interface IProcessedMessageCreation
    extends Optional<IProcessedMessageData, "id" | "processedAt"> { }

export class ProcessedMessage
    extends Model<IProcessedMessageData, IProcessedMessageCreation>
    implements IProcessedMessageData {
    public id!: number;
    public messageId!: string;
    public processedAt!: Date;
}

export default (sequelize: Sequelize) => {
    ProcessedMessage.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            messageId: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            processedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            tableName: "processed_messages",
            timestamps: false,
        }
    );

    return ProcessedMessage;
};
