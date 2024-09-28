import { join } from "path";
import { DataSource, DefaultNamingStrategy, Table } from "typeorm";

export const initializeDataSource = async (dataSource: DataSource) => {
  if (dataSource.isInitialized) {
    return;
  }
  await dataSource.initialize();
};

export const createDataSource = (dirName: string) => {
  return new DataSource({
    type: "sqlite",
    database: ":memory:",
    entities: [join(`${dirName}/**/*.entity.ts`)],
    synchronize: true,
    namingStrategy: new CustomNamingStrategy(),
    logging: true,
  });
};

class CustomNamingStrategy extends DefaultNamingStrategy {
  foreignKeyName(tableOrName: Table | string, columnNames: string[], _referencedTablePath?: string): string {
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();
    const tableName = this.getTableName(tableOrName);
    const referencedTableName = _referencedTablePath === undefined ? tableName : _referencedTablePath;
    const key = `${tableName}_${referencedTableName}_${clonedColumnNames.join("_")}`;

    return `fk_${key}`;
  }
}
