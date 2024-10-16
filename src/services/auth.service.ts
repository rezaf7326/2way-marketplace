import * as jwt from 'jsonwebtoken';
import { User } from '../database/entities';
import { Repository } from 'sequelize-typescript';
import { Database } from '../database/database';
import { Logger } from '../common/logger/logger';
import { Singleton } from '../common/abstraction';
import { StaticImplements } from '../common/custom-decorators';
import { CryptoHelper } from '../common/helpers/crypto.helper';
import { ConfigContainer } from '../common/config';
import { Unauthorized } from 'http-errors';
import { SignInDto } from '../dtos';

@StaticImplements<Singleton<AuthService>>()
export class AuthService {
  private static instance: AuthService;
  private readonly logger: Logger;
  private readonly userRepository: Repository<User>;

  private constructor() {
    this.logger = new Logger(this.constructor.name);
    this.userRepository = Database.ref.connection.getRepository(User);
  }

  static get ref(): AuthService {
    if (!this.instance) {
      this.instance = new AuthService();
    }
    return this.instance;
  }

  async signIn(
    { email, password }: SignInDto,
    metadata?: string,
  ): Promise<{ accessToken: string }> {
    this.logger.debug('user sign-in');
    const user = await this.userRepository.findOne({ where: { email } });
    const validPass = await CryptoHelper.compareHash(
      password,
      user.passwordHash,
    );
    if (!validPass) {
      throw new Unauthorized('invalid password');
    }
    this.logger.verbose('user sign-in validated');
    try {
      await this.userRepository.update(
        { lastLogin: new Date() },
        { where: { id: user.id } },
      );
    } catch (error) {
      this.logger.error(`failed to update user last login: ${error}`);
    }

    // TODO use "metadata" for session management

    return { accessToken: this.generateAccessToken(user.id) };
  }

  private generateAccessToken(userId: number): string {
    this.logger.debug('generate access and refresh tokens');
    const { jwtSecret, accessExpHours } = ConfigContainer.config().general;

    return jwt.sign({}, jwtSecret, {
      subject: userId.toString(),
      expiresIn: accessExpHours + 'h',
    });
  }
}
