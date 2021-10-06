function errorHandler(err, response) {
  if (!response) throw err

  const errType = err.name
  switch (errType) {
    case 'InvalidRequestError':
      return response
        .status(400)
        .json({ err: 'bad_request', message: err.message, detail: err.detail })
    case 'AuthCantVerify':
      return response
        .status(401)
        .json({ err: 'wrong_auth', message: 'Wrong_auth' })
    case 'Forbidden':
      return response
        .status(403)
        .json({ err: 'forbidden', message: err.message, detail: err.detail || 'forbidden' })
    case 'NotFoundError':
      return response
        .status(404)
        .json({ err: 'not_found', message: err.message })
    case 'OutOfStockError':
      return response
        .status(406)
        .json({ err: 'bad_request', message: err.message })
    case 'UserDuplicateError':
      return response
        .status(409)
        .json({ err: 'conflict', message: err.message })
    case 'RequestLargeError':
      return response
        .status(413)
        .json({ err: 'bad_request', message: err.message, detail: err.detail })
    default:
      return response
        .status(500)
        .json({ err: 'internal', message: err.message || 'error' })
  }
}

module.exports = {
  errorHandler
}
