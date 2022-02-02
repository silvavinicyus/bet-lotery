import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Cart from 'App/Models/Cart';
import { v4 as uuidV4 } from 'uuid';

export default class CartSeeder extends BaseSeeder {
  public static developmentOnly = true;

  public async run() {
    const id = uuidV4();
    await Cart.create({
      id,
      value: 30,
    });
  }
}
