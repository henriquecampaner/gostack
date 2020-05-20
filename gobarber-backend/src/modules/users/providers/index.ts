import { container } from 'tsyringe';

import iHashProvider from './HashProvider/models/iHashProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

container.registerSingleton<iHashProvider>('HashProvider', BCryptHashProvider);
