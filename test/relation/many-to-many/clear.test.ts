import { createDataSource, initializeDataSource } from "../../data-source";
import { Category } from "./entity/category.entity";
import { Question } from "./entity/question.entity";

const dataSource = createDataSource(__dirname);

beforeAll(async () => {
  await initializeDataSource(dataSource);
});

beforeEach(async () => {
  const category1 = new Category();
  category1.name = "ORMs";

  const category2 = new Category();
  category2.name = "Programming";

  const question = new Question();
  question.title = "How to ask questions?";
  question.text = "Where can I ask TypeORM-related questions?";
  question.categories = [category1, category2];

  await dataSource.manager.save(question);

  await expect(dataSource.manager.count(Question)).resolves.toBe(1);
  await expect(dataSource.manager.count(Category)).resolves.toBe(2);
});

afterEach(async () => {
  await Promise.allSettled([dataSource.manager.clear(Question), dataSource.manager.clear(Category)]);
});

describe("M:N cascade clear 테스트: M:N 관계에서는 상위 엔티티를 제거해도 하위 엔티티가 제거되지 않음", () => {
  test("상위 엔티티만 제거", async () => {
    await dataSource.manager.clear(Question);

    await expect(dataSource.manager.count(Question)).resolves.toBe(0);
    await expect(dataSource.manager.count(Category)).resolves.toBe(2);
  });

  test("cascade된 모든 엔티티 제거", async () => {
    await dataSource.manager.clear(Question);
    await dataSource.manager.clear(Category);

    await expect(dataSource.manager.count(Question)).resolves.toBe(0);
    await expect(dataSource.manager.count(Category)).resolves.toBe(0);
  });
});
