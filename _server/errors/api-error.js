class APIError extends Error {
  constructor(name, message, detail) {
    super();
    this.name = name;
    this.message = message;
    this.detail = detail;
  }
}

export default APIError;
