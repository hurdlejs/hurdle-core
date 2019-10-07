import * as got from 'got';
import { HurdleAction } from '../../action/action';
import { RunnerState } from '../../runner/state';


export class HttpAction implements HurdleAction {
  static id = 'http';
  properties: any = {
    url: ''
  };

  async execute(state: RunnerState): Promise<object> {
    try {
      const response = await got(this.properties);
      let data = {};

      let contentType = response.headers["content-type"];
      if (contentType && contentType.includes('application/json')) {
        data = JSON.parse(response.body);
        contentType = 'application/json';
      } else if (contentType && (contentType.includes('text/xml') || contentType.includes('application/xml'))) {
        contentType = 'application/xml';
        // handle xml
      }

      return {
        body: response.body,
        headers: response.headers,
        data: data,
        statusCode: response.statusCode,
        statusMessage: response.statusMessage,
        url: response.url,
        retryCount: response.retryCount,
        httpVersion: response.httpVersion,
        httpVersionMajor: response.httpVersionMajor,
        httpVersionMinor: response.httpVersionMinor,
        rawHeaders: response.rawHeaders,
        redirectUrls: response.redirectUrls,
        contentType: contentType
      };
    } catch (error) {
      console.log(error.response.body);
    }
    return {};
  }
}