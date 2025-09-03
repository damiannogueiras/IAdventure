/**
 * SessionService manages the conversation history for a chat application.
 * It stores messages with their roles (user or assistant) and limits the history size.
 */
export class SessionService {
  private history: { role: string; content: string }[] = [];
  private maxHistory: number;

  constructor(maxHistory: number = 5) {
    this.maxHistory = maxHistory;
  }

  addMessage(role: string, content: string) {
    this.history.push({ role, content });
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  getHistory() {
    return [...this.history];
  }

  clearHistory() {
    this.history = [];
  }
}