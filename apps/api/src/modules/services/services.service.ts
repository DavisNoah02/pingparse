import { servicesRepository } from './services.repository.ts';
import { scheduleService, unscheduleService } from '../../scheduler/index.ts';
import type { CreateServiceInput, UpdateServiceInput } from './services.schema.ts';

export class ServiceNotFoundError extends Error {
  constructor(id: number) {
    super(`Service with id ${id} not found`);
    this.name = 'ServiceNotFoundError';
  }
}

export class ServiceUrlConflictError extends Error {
  constructor(url: string) {
    super(`Service with url ${url} already exists`);
    this.name = 'ServiceUrlConflictError';
  }
}

export const servicesService = {
  async getAll() {
    return servicesRepository.findAll();
  },

  async getById(id: number) {
    const service = servicesRepository.findById(id);
    if (!service) throw new ServiceNotFoundError(id);
    return service;
  },

  async create(input: CreateServiceInput) {
    const existing = servicesRepository.findByUrl(input.url);
    if (existing) throw new ServiceUrlConflictError(input.url);

    const service = servicesRepository.create(input);
    if (!service) throw new Error('Failed to create service');

    // Start monitoring immediately
    scheduleService(service.id, service.url, service.interval);

    return service;
  },

  async update(id: number, input: UpdateServiceInput) {
    const service = servicesRepository.findById(id);
    if (!service) throw new ServiceNotFoundError(id);

    const updated = servicesRepository.update(id, input);
    if (!updated) throw new Error('Failed to update service');

    // Reschedule if interval or active state changed
    if (updated.isActive) {
      scheduleService(updated.id, updated.url, updated.interval);
    } else {
      unscheduleService(updated.id);
    }

    return updated;
  },

  async remove(id: number) {
    const service = servicesRepository.findById(id);
    if (!service) throw new ServiceNotFoundError(id);

    // Stop monitoring before deleting
    unscheduleService(id);

    return servicesRepository.remove(id);
  },
};