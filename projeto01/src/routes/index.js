import { Database } from '../db/database.js'
import { UsersRoutes } from './user.routes.js';
import { TasksRoutes } from './tasks.routes.js';

const database = new Database()
const usersRoutes = new UsersRoutes(database)
const tasksRoutes = new TasksRoutes(database)

console.log(usersRoutes.build())
console.log(tasksRoutes.build())

let routes = usersRoutes.build();
routes = routes.concat(tasksRoutes.build());

export default routes;