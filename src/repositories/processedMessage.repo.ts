import { IProcessedMessageCreation, ProcessedMessage } from "../models/processsedMessage.model";

class ProcessedMessageRepo {
    constructor(private ProcessedMessageModel: typeof ProcessedMessage) { }

    async findByMessageId(messageId: number) {
        return this.ProcessedMessageModel.findOne({ where: { messageId } });
    }

    async create(data: IProcessedMessageCreation) {
        return this.ProcessedMessageModel.create(data);
    }
}


export default ProcessedMessageRepo;