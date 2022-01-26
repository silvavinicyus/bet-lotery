import HealthCheck from '@ioc:Adonis/Core/HealthCheck';
import Route from '@ioc:Adonis/Core/Route';
import GamesController from 'App/Controllers/Http/GamesController';

Route.get('/health', async ({ response }) => {
  const report = await HealthCheck.getReport();
  return report.healthy ? response.ok(report) : response.badRequest(report);
});

Route.post('/games', 'GamesController.create');

Route.get('/games', 'GamesController.read');

Route.get('/games/:id', 'GamesController.getById');

Route.delete('/games/:id', 'GamesController.deleteById');

Route.put('/games/:id', 'GamesController.update');
