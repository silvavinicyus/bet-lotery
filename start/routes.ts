import HealthCheck from '@ioc:Adonis/Core/HealthCheck';
import Route from '@ioc:Adonis/Core/Route';

Route.get('/health', async ({ response }) => {
  const report = await HealthCheck.getReport();
  return report.healthy ? response.ok(report) : response.badRequest(report);
});

// games
Route.post('/games', 'GamesController.create');
Route.get('/games', 'GamesController.index');
Route.get('/games/:id', 'GamesController.getById');
Route.delete('/games/:id', 'GamesController.deleteById');
Route.put('/games/:id', 'GamesController.update');

// users
Route.post('/users', 'UsersController.create');
Route.get('/users', 'UsersController.index');
Route.get('/users/:id', 'UsersController.getById');
Route.delete('/users/:id', 'UsersController.delete');
Route.put('/users/:id', 'UsersController.update');

// bets
Route.post('/bets/users/:userId/games/:gameId', 'BetsController.create');
Route.get('/bets', 'BetsController.index');
