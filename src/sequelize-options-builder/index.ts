import { Sequelize, Attributes, FindOptions, Model, Op } from 'sequelize';

export interface AggregateItem {
  field: string;
  aggregate: string;
}

export interface FilterItem {
  field: string;
  value: number | string | boolean;
  operator: string;
}

export interface Filter {
  logic: 'and' | 'or';
  filters: FilterItem[];
}

export interface GroupItem {
  field: string;
  dir: 'asc' | 'desc';
}

export interface SortItem {
  field: string;
  dir: 'asc' | 'desc';
}

export interface QueryInterface {
  attributes?: string[];
  aggregates?: AggregateItem[];
  filter?: Filter;
  group?: GroupItem[];
  sort?: SortItem[];
  take?: number;
  offset?: number;
  bucket?: string;
  bucketField?: string;
}

export class SequelizeOptionsBuilder<M extends Model> {
  private sequelize!: Sequelize;

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }

  build(query: QueryInterface) {
    const {
      attributes: queryAttributes = [],
      aggregates = [],
      filter = {
        logic: 'and',
        filters: [],
      },
      group = [],
      sort = [],
      bucket,
      bucketField,
    } = query;

    const options: FindOptions = {};

    const attributes: Attributes<M>[] = queryAttributes;

    if (aggregates.length > 0) {
      if (options.attributes == null) {
        options.attributes = [];
      }

      for (const aggregateItem of aggregates) {
        attributes.push([
          this.sequelize.fn(
            aggregateItem.aggregate,
            this.sequelize.col(aggregateItem.field),
          ),
          `${aggregateItem.field}_${aggregateItem.aggregate}`,
        ]);
      }
    }

    if (filter && filter.filters) {
      options.where = {};

      for (const filterItem of filter.filters) {
        if (!options.where[filterItem.field]) {
          options.where[filterItem.field] = {};
        }

        let operator;
        let filterValue: any = filterItem.value;
        switch (filterItem.operator) {
          case 'gt':
            operator = Op.gt;
            break;
          case 'gte':
            operator = Op.gte;
            break;
          case 'lte':
            operator = Op.lte;
            break;
          case 'lt':
            operator = Op.lt;
            break;
          case 'in':
            operator = Op.in;
            if (!Array.isArray(filterValue)) {
              filterValue = filterValue.toString().split(',');
            }
            break;
          case 'notin':
            operator = Op.notIn;
            if (!Array.isArray(filterValue)) {
              filterValue = filterValue.toString().split(',');
            }
            break;
          case 'contains':
            operator = Op.iLike;
            filterValue = `%${filterValue}%`;
            break;
          case 'notcontains':
            operator = Op.notILike;
            filterValue = `%${filterValue}%`;
            break;
          default:
            operator = Op.eq;
        }

        options.where[filterItem.field][operator] = filterValue;
      }
    }

    if (group.length > 0) {
      options.group = group.map((groupItem) => groupItem.field);
    }

    if (sort.length > 0) {
      options.order = sort.map((sortItem) => [sortItem.field, sortItem.dir]);
    }

    if (bucket && bucketField) {
      attributes.push([
        this.sequelize.fn(
          'date_trunc',
          bucket,
          this.sequelize.col(bucketField),
        ),
        'bucket',
      ]);
      options.group = ['bucket'];
    }

    if (attributes.length > 0) {
      options.attributes = attributes;
    }

    return options;
  }
}
