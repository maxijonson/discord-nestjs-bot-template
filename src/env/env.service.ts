import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Env } from "./env";

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {}

  get<T extends keyof Env>(key: T) {
    return this.configService.get(key, { infer: true });
  }

  get railway() {
    return {
      publicDomain: this.get("RAILWAY_PUBLIC_DOMAIN"),
      privateDomain: this.get("RAILWAY_PRIVATE_DOMAIN"),
      projectName: this.get("RAILWAY_PROJECT_NAME"),
      environmentName: this.get("RAILWAY_ENVIRONMENT_NAME"),
      serviceName: this.get("RAILWAY_SERVICE_NAME"),
      projectId: this.get("RAILWAY_PROJECT_ID"),
      environmentId: this.get("RAILWAY_ENVIRONMENT_ID"),
      serviceId: this.get("RAILWAY_SERVICE_ID"),
    };
  }
}
