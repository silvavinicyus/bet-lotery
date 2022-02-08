import Mail from '@ioc:Adonis/Addons/Mail';
import { BaseTask } from 'adonis5-scheduler/build/src/Scheduler/Task';
import User from 'App/Models/User';
import { Kafka } from 'kafkajs';

export default class SendEmailWhenNotBetting extends BaseTask {
  public static get schedule() {
    return '01 04 * * *';
  }
  public static get useLock() {
    return false;
  }

  public async handle() {
    this.logger.info('Startind schedule');

    const users = await User.query().preload('bets');

    const dateNow = new Date().getTime();
    const daysInMilliseconds = 86400000;

    const kafka = new Kafka({
      clientId: 'bet-lotery',
      brokers: ['localhost:9092', 'kafka:29092'],
    });

    const producerNoBet = kafka.producer();

    await producerNoBet.connect();

    users.forEach(async (user) => {
      const lastBet = user.bets.pop();
      let diffDaysLastBets;

      if (lastBet) {
        diffDaysLastBets = Math.ceil((dateNow - lastBet.createdAt.toMillis()) / daysInMilliseconds);
      }

      const diffDaysUserCreated = Math.ceil(
        (dateNow - user.createdAt.toMillis()) / daysInMilliseconds
      );

      if ((user.bets.length === 0 && diffDaysUserCreated >= 7) || diffDaysLastBets >= 7) {
        const message = {
          subject: `Let's Bet!`,
          type: 'noBet',
          username: user.name,
          email: user.email,
        };

        await producerNoBet.send({
          topic: 'no_betting',
          messages: [{ value: JSON.stringify(message) }],
        });
      }
    });
  }
}
