import { User } from '../database/entities';
import { Repository } from 'sequelize-typescript';
import { Database } from '../database/database';
import { Logger } from '../common/logger/logger';
import { Singleton } from '../common/abstraction';
import { StaticImplements } from '../common/custom-decorators';
import { UserStatus } from '../common/enums';
import { CryptoHelper } from '../common/helpers/crypto.helper';
import { SignUpDto } from '../dtos';

@StaticImplements<Singleton<UserService>>()
export class UserService {
  private static instance: UserService;
  private readonly logger: Logger;
  private readonly userRepository: Repository<User>;

  private constructor() {
    this.logger = new Logger(this.constructor.name);
    this.userRepository = Database.ref.connection.getRepository(User);
  }

  static get ref(): UserService {
    if (!this.instance) {
      this.instance = new UserService();
    }
    return this.instance;
  }

  async createUser(user: SignUpDto): Promise<User> {
    this.logger.debug(`create user with email: ${user.email}`);
    const newUser = await this.userRepository.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      status: UserStatus.Created,
      passwordHash: await CryptoHelper.hash(user.password),
    });
    delete newUser.passwordHash;
    this.logger.info(`successfully created user: ${JSON.stringify(newUser)}`);

    return newUser;
  }

  findOne(where: Partial<{ email: string; id: number }>): Promise<User | null> {
    this.logger.debug(`find user: ${JSON.stringify(where)}`);
    return this.userRepository.findOne({ where });
  }

  async isAccountActivated(userId: number): Promise<boolean> {
    const user = await this.userRepository.findByPk(userId);
    return user?.status === UserStatus.Active;
  }

  async isAccountSuspended(userId: number): Promise<boolean> {
    const user = await this.userRepository.findByPk(userId);
    return user?.status === UserStatus.Suspended;
  }

  async sendConfirmationEmail(userId: number, email: string): Promise<void> {
    this.logger.debug(
      `send confirmation email: ${JSON.stringify({ email, userId })}`,
    );
    // TODO:
    //  1. Find the user register token from --user register-token table--
    //      by "userId"
    //  2. If token does not exist, generate a random token and set it for the
    //      user in --user register-token table-- // CryptoHelper.randomHex(32)
    //  3. Create an activation link having frontend url and the token
    //  4. Send an email containing the activation link to the user
  }

  async activateUserAccount(token: string): Promise<void> {
    this.logger.debug('activate user account');
    // TODO:
    //  1. Find the user id from --user register-token table-- by "token"
    //  2. If activation token is invalid throw http error
    //  3. If all good, update user status to UserStatus.Active
  }
}
