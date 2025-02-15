import { container } from 'tsyringe';
import uploadConfig from '@config/upload';

import iStorageProvider from './models/iStorageProvider';

import DiskStorageProvider from './implementations/DiskStorageProvider';
import S3StorageProvider from './implementations/S3StorageProvider';

const providers = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};

container.registerInstance<iStorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);
