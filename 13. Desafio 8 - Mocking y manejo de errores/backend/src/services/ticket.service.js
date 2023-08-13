import ticketDAO from "../dao/ticket.dao.js";

class TicketService {
	constructor() {
		this.model = ticketDAO;
	}

	async createTicket(ticket) {
		return await this.model.createTicket(ticket);
	}

	async getTicketById(id) {
		return await this.model.getTicketById(id);
	}
}

const ticketService = new TicketService();
export default ticketService;