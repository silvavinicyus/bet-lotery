import HealthCheck from '@ioc:Adonis/Core/HealthCheck';
import Route from '@ioc:Adonis/Core/Route';

Route.get('/health', async ({ response }) => {
  const report = await HealthCheck.getReport();
  return report.healthy ? response.ok(report) : response.badRequest(report);
});

// games
Route.resource('/games', 'GamesController');

// users
Route.resource('/users', 'UsersController');

// bets
Route.post('/bets/users/:userId/games/:gameId', 'BetsController.store');
Route.resource('/bets', 'BetsController');

// permissions
Route.resource('/permissions', 'PermissionsController');

//user permissions
Route.post('/permissions/add/:userId', 'UserPermissionsController.addPermission');
Route.delete('/permissions/remove/:id', 'UserPermissionsController.removePermission');

// authenticate
Route.post('/authenticate', 'AuthController.login');
