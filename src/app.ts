import * as cors from 'cors';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Logger } from './common/logger/logger';
import { ConfigContainer } from './common/config';
import { ErrorRequestHandler, Router } from 'express';

export class App {
  private readonly app: express.Express;
  private readonly logger: Logger;

  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.logger = new Logger(this.constructor.name);
  }

  router(router: Router) {
    this.logger.debug('starting server');
    let prefix = App.globalPrefixAndApiVersion();
    if (prefix && !prefix.startsWith('/')) {
      prefix = `/${prefix}`;
    }
    prefix ? this.app.use(prefix, router) : this.app.use(router);
    this.logger.debug(`prefixed all routes with: ${prefix}`);
  }

  globalErrorHandler(handler: ErrorRequestHandler) {
    this.logger.debug('set global error handler');
    this.app.use(handler);
  }

  cors(origin?: Array<string>) {
    this.app.use(origin ? cors({ origin }) : cors());
  }

  start() {
    this.app.listen(ConfigContainer.config().general.port, () =>
      this.logger.info(
        `server is listening on port ${ConfigContainer.config().general.port}`,
      ),
    );
  }

  static globalPrefixAndApiVersion(): string {
    const { globalPrefix: gPref, apiVersion: apiV } =
      ConfigContainer.config().general;
    if (gPref && apiV) {
      return `${gPref}/v${apiV}`;
    }
    return gPref || (apiV ? `v${apiV}` : '');
  }
}
