import { Injectable, Inject } from '@nestjs/common';
import Project from '../models/project';

@Injectable()
export class ProjectService {
  constructor(
    @Inject('PROJECT_REPOSITORY')
    private projectRepository: typeof Project,
  ) {}

  findAll(): Promise<Project[]> {
    return this.projectRepository.findAll<Project>();
  }

  getById(id: string): Promise<Project> {
    return this.projectRepository.findByPk(id);
  }
}
