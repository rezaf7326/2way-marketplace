import * as amqp from 'amqplib';
import { ConfigContainer } from '../common/config';
import { Bootable, Singleton } from '../common/abstraction';
import { StaticImplements } from '../common/custom-decorators';
import { Logger } from '../common/logger/logger';

@StaticImplements<Singleton<RabbitMQ>>()
export class RabbitMQ implements Bootable {
  private static instance: RabbitMQ;
  private readonly logger: Logger;
  private channel: amqp.Channel;

  private constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  static get ref(): RabbitMQ {
    if (!this.instance) {
      this.instance = new RabbitMQ();
    }
    return this.instance;
  }

  async boot(): Promise<void> {
    this.logger.info('booting rabbitmq connection');
    const connection = await amqp.connect(
      ConfigContainer.config().rabbitmq.url,
    );
    this.channel = await connection.createChannel();
    this.logger.debug('rabbitmq booted');
  }

  async assertQueue(queue: string, durable = true): Promise<void> {
    this.logger.info(`asserting queue: ${JSON.stringify({ queue, durable })}`);
    // create queue if does not exist and ensure the queue survives a RabbitMQ restart
    await this.channel.assertQueue(queue, { durable });
    this.logger.debug(`queue "${queue}" is ready`);
  }

  sendMessage(queue: string, event: string, body: any): boolean {
    const buffer = Buffer.from(JSON.stringify({ event, body }));
    return this.channel.sendToQueue(queue, buffer);
  }
}
