import { servicesRepository } from './services.repository.ts';
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
    return servicesRepository.create(input);
  },

  async update(id: number, input: UpdateServiceInput) {
    const service = servicesRepository.findById(id);
    if (!service) throw new ServiceNotFoundError(id);
    return servicesRepository.update(id, input);
  },

  async remove(id: number) {
    const service = servicesRepository.findById(id);
    if (!service) throw new ServiceNotFoundError(id);
    return servicesRepository.remove(id);
  },
};