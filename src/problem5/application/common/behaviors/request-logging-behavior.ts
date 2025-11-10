import { ICommand, IPipelineBehavior } from '@qnn92/mediatorts';

export default class RequestLoggingBehavior implements IPipelineBehavior {
  handle = async (request: ICommand, next: () => Promise<any>): Promise<any> => {
    console.log(`Handling request`, request);
    try {
      const response = await next();
      console.log(`Request of type: ${request.constructor.name} handled successfully`);
      return response;
    } catch (error) {
      console.error(`Error handling request of type: ${request.constructor.name}`, error);
      throw error;
    }
  };
}
