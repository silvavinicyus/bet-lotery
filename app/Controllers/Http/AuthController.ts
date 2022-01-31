import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const { email, password } = request.body();

    try {
      console.log(email);
      console.log(password);
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '24hours',
      });
      return token.toJSON();
    } catch (err) {
      return response.badRequest('Invalid credentials' + err);
    }
  }
}
