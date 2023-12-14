import { container } from './inversify.config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function autoProvide(...services: any[]): void {
  services.forEach((service) => {
    container.bind(service).toSelf();
  });
}
