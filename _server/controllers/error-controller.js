function errorHandler(error, response) {
  if (!response) throw error

  const errType = error.name
  switch (errType) {
    case 'InvalidRequestError':
      return response
        .status(400)
        .json({ error: 'bad_request', message: error.message, detail: error.detail })
    case 'AuthCantVerify':
      return response
        .status(401)
        .json({ error: 'wrong_auth', message: 'Wrong_auth' })
    case 'Forbidden':
      return response
        .status(403)
        .json({ error: 'forbidden', message: error.message, detail: error.detail || 'forbidden' })
    case 'NotFoundError':
      return response
        .status(404)
        .json({ error: 'not_found', message: error.message })
    case 'OutOfStockError':
      return response
        .status(406)
        .json({ error: 'bad_request', message: error.message })
    case 'UserDuplicateError':
      return response
        .status(409)
        .json({ error: 'conflict', message: error.message })
    case 'RequestLargeError':
      return response
        .status(413)
        .json({ error: 'bad_request', message: error.message, detail: error.detail })
    default:
      return response
        .status(500)
        .json({ error: 'internal', message: error.message || 'error' })
  }
}

module.exports = {
  errorHandler
}
