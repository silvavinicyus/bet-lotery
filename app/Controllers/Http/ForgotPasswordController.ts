import Hash from '@ioc:Adonis/Core/Hash';
import Mail from '@ioc:Adonis/Addons/Mail';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import Token from 'App/Models/Token';
import Env from '@ioc:Adonis/Core/Env';
import ForgotPasswordValidator from 'App/Validators/ForgotPassword/ForgotPasswordValidator';
import { Kafka } from 'kafkajs';

export default class ForgotPasswordController {
  public async store({ request, response }: HttpContextContract) {
    await request.validate(ForgotPasswordValidator);

    const { secureId } = request.params();

    console.log(secureId);

    const user = await User.findByOrFail('secure_id', secureId);

    const token = await Hash.make(`token-password+${user.email}`);

    await Token.create({
      token: token,
      user_id: user.id,
      type: 'forgot-password',
    });

    const forgtPasswordUrl = `${Env.get('FRONTEND_URL')}/reset?token=${token}`;

    const kafka = new Kafka({
      clientId: 'bet-lotery',
      brokers: ['localhost:9092', 'kafka:29092'],
    });

    const producerForgetPassword = kafka.producer();

    await producerForgetPassword.connect();

    const message = {
      subject: `Forgot Password`,
      type: 'forgotPassword',
      username: user.name,
      email: user.email,
      url: forgtPasswordUrl,
    };

    await producerForgetPassword.send({
      topic: 'forget_password',
      messages: [{ value: JSON.stringify(message) }],
    });

    return response.noContent();
  }
}
