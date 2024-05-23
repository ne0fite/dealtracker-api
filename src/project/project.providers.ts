import Project from '../models/project';

export const projectProviders = [
  {
    provide: 'PROJECT_REPOSITORY',
    useValue: Project,
  },
];
