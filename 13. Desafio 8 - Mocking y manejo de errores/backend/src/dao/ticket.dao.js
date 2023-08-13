import { ticketModel } from '../models/ticket.model.js';

class TicketDAO {
	constructor() {
		this.model = ticketModel;
	}

	async createTicket(ticket) {
        return await this.model.create(ticket);
	}

	async getTicketById(id) {
		return await this.model.findById(id);
	}
}

const ticketDAO = new TicketDAO();
export default ticketDAO;