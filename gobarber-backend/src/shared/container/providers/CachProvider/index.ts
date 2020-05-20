import { container } from 'tsyringe';

import iCacheProvider from './models/iCacheProvider';

import RedisCacheProvider from './implementations/RedisCacheProvider';

const provider = {
  redis: RedisCacheProvider,
};

container.registerSingleton<iCacheProvider>('CacheProvider', provider.redis);
