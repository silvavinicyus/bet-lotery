import Mail from '@ioc:Adonis/Addons/Mail';
import { BaseTask } from 'adonis5-scheduler/build/src/Scheduler/Task';
import User from 'App/Models/User';

export default class SendEmailWhenNotBetting extends BaseTask {
  public static get schedule() {
    // return '0 9 * * *';
    return '14 21 * * *';
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

    const { createdAt } = await User.query().firstOrFail();

    console.log(createdAt);

    console.log(
      await Mail.preview((message) => {
        message
          .from('info@example.com')
          .to('vinicyus346@gmail.com')
          .subject('Welcome Onboard!')
          .htmlView('emails/nobet', { name: 'Vinicyus' });
      })
    );
  }
}
