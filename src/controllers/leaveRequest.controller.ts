import { NextFunction, Request, Response } from "express";
import LeaveRequestService from '../services/leaveRequest.service';


class LeaveRequestController {
    private service: LeaveRequestService;

    constructor(service: LeaveRequestService) { this.service = service; }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { employeeId, startDate, endDate } = req.body;
            const lr = await this.service.createLeave({ employeeId, startDate, endDate, status: 'PENDING' });
            return res.success(lr);
        } catch (err) { next(err); }
    }
}
export default LeaveRequestController;
