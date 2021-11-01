import errorHandler from './error-controller.js';

function expressHandler ({ validator, handler }) {
  return async (request, response, next) => {
    try {
      const responseJson = await handler(request, response)
      // validator(responseJson)
      response.json({ code:200 , ...responseJson })
    } catch (err) {
      errorHandler(err, response)
    }
  }
}
export {
  expressHandler,
};
