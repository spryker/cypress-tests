import { interfaces } from 'inversify';
import { container } from './inversify.config';

export function autoWired(...services: interfaces.ServiceIdentifier[]): void {
  services.forEach((service) => {
    container.bind(service).toSelf();
  });
}
