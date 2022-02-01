import Mail from '@ioc:Adonis/Addons/Mail';
import { BaseTask } from 'adonis5-scheduler/build/src/Scheduler/Task';
import User from 'App/Models/User';

export default class SendEmailWhenNotBetting extends BaseTask {
  public static get schedule() {
    // return '0 9 * * *';
    return '54 03 * * *';
  }
  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `build/tmpTaskLock`
   */
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

      if (user.bets.length === 0 || diffDays > 30) {
        await Mail.preview((message) => {
          message
            .from('info@example.com')
            .to('vinicyus346@gmail.com')
            .subject("Let's Bet!")
            .htmlView('emails/nobet', { name: 'Vinicyus' });
        });
      }
    });
  }
}
