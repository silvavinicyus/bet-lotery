import HealthCheck from '@ioc:Adonis/Core/HealthCheck';
import Route from '@ioc:Adonis/Core/Route';

Route.get('/health', async ({ response }) => {
  const report = await HealthCheck.getReport();
  return report.healthy ? response.ok(report) : response.badRequest(report);
});

// games
Route.resource('/games', 'GamesController').middleware({
  '*': ['auth', 'isAdmin'],
});

// users
Route.resource('/users', 'UsersController').middleware({
  index: ['auth', 'isAdmin'],
  destroy: ['auth', 'isPlayer'],
  update: ['auth', 'isPlayer'],
  show: ['auth', 'isPlayer'],
});

// bets
Route.resource('/bets', 'BetsController').middleware({
  '*': ['auth'],
  'create': ['isPlayer'],
  'destroy': ['isPlayer'],
  'index': ['isAdmin'],
});

// permissions
Route.resource('/permissions', 'PermissionsController').middleware({
  '*': ['auth', 'isAdmin'],
});

//user permissions
Route.post('/permissions/add/:userId', 'UserPermissionsController.addPermission').middleware([
  'auth',
  'isAdmin',
]);
Route.delete('/permissions/remove/:id', 'UserPermissionsController.removePermission').middleware([
  'auth',
  'isAdmin',
]);

// authenticate
Route.post('/authenticate', 'AuthController.login');
Route.post('/forgot/:secureId', 'ForgotPasswordController.store');
Route.post('/reset', 'ResetPasswordController.store');
