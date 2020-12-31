import { ConfigModule } from '@nestjs/config';
import { environment } from '../environments/environment';

export const ConfigModuleImport = ConfigModule.forRoot({
  isGlobal: true,
  ignoreEnvFile: true,
  cache: true,
  load: [() => environment],
  // validate,
});
