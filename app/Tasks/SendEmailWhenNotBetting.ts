import Mail from '@ioc:Adonis/Addons/Mail';
import { BaseTask } from 'adonis5-scheduler/build/src/Scheduler/Task';
import User from 'App/Models/User';

export default class SendEmailWhenNotBetting extends BaseTask {
  public static get schedule() {
    return '0 9 * * *';
  }
  public static get useLock() {
    return false;
  }

  public async handle() {
    this.logger.info('Startind schedule');

    const users = await User.query().preload('bets');

    const dateNow = new Date().getTime();
    const daysInMilliseconds = 86400000;

    users.forEach(async (user) => {
      const diffDays = Math.ceil((dateNow - user.createdAt.toMillis()) / daysInMilliseconds);

      if (user.bets.length === 0 || diffDays > 7) {
        await Mail.send((message) => {
          message
            .from('admin@bet.lotery.com')
            .to(user.email)
            .subject("Let's Bet!")
            .htmlView('emails/nobet', { name: user.name });
        });
      }
    });
  }
}
