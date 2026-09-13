export interface CreateTicketPayload {
  title: string;
  description: string;
  requesterId: string;
}

export interface CreateTicketResponse {
  id: string;
  status: string;
}

export interface TicketRequest {
  id: string;
  title: string;
  description: string;
  requesterId: string;
  category?: string | null;
  urgencyScore?: number | null;
  finalPriority?: number | null;
  queuePosition?: number | null;
  requesterDepartment?: string | null;
  requesterManagerEmail?: string | null;
  status: 'PENDING' | 'PROCESSED' | 'PROCESSING_FAILED' | 'RESOLVED' | string;
  errorDetail?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

const API_BASE_URL = 'http://localhost:8080/api';

export async function createTicket(payload: CreateTicketPayload): Promise<CreateTicketResponse> {
  const res = await fetch(`${API_BASE_URL}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error(`Failed to create request: ${res.statusText}`);
  }
  return res.json();
}

export async function getTickets(): Promise<TicketRequest[]> {
  const res = await fetch(`${API_BASE_URL}/requests`);
  if (!res.ok) {
    throw new Error(`Failed to fetch requests: ${res.statusText}`);
  }
  return res.json();
}

export async function getTicketById(id: string): Promise<TicketRequest> {
  const res = await fetch(`${API_BASE_URL}/requests/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch request ${id}: ${res.statusText}`);
  }
  return res.json();
}

export async function updateTicketStatus(id: string, status: string): Promise<TicketRequest> {
  const res = await fetch(`${API_BASE_URL}/requests/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) {
    throw new Error(`Failed to update request status: ${res.statusText}`);
  }
  return res.json();
}
