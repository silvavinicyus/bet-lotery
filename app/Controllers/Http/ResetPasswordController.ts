import Hash from '@ioc:Adonis/Core/Hash';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ApiToken from 'App/Models/ApiToken';
import Token from 'App/Models/Token';
import User from 'App/Models/User';
import UserPermission from 'App/Models/UserPermission';
import ResetPasswordValidator from 'App/Validators/ForgotPassword/ResetPasswordValidator';

export default class ResetPasswordController {
  public async store({ request, response }: HttpContextContract) {
    await request.validate(ResetPasswordValidator);

    const { password } = request.body();
    const { token } = request.qs();

    const tokenExists = await Token.findByOrFail('token', token);

    const user = await User.findOrFail(tokenExists.user_id);

    user.password = await Hash.make(password);

    await user.save();

    await ApiToken.query().delete().where('user_id', user.id);

    await tokenExists.delete();

    return response.ok({
      message: 'Password succesfully changed',
    });
  }
}
