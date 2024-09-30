import { createDataSource, initializeDataSource } from "../../data-source";
import { Category } from "./entity/category.entity";
import { Question } from "./entity/question.entity";

const dataSource = createDataSource(__dirname);

beforeAll(async () => {
  await initializeDataSource(dataSource);
});

afterEach(async () => {
  await Promise.allSettled([dataSource.manager.clear(Question), dataSource.manager.clear(Category)]);
});

describe("M:N cascade 테스트", () => {
  test("cascade로 저장하는 테스트", async () => {
    const category1 = new Category();
    category1.name = "ORMs";

    const category2 = new Category();
    category2.name = "Programming";

    const question = new Question();
    question.title = "How to ask questions?";
    question.text = "Where can I ask TypeORM-related questions?";
    question.categories = [category1, category2];

    await dataSource.manager.save(question);

    await expect(dataSource.manager.count(Category)).resolves.toBe(2);
    await expect(dataSource.manager.count(Question)).resolves.toBe(1);
  });

  test("cascade 설정이 되어있지만 엔티티 하나만 저장하는 테스트", async () => {
    const question = new Question();
    question.title = "How to ask questions?";
    question.text = "Where can I ask TypeORM-related questions?";

    await dataSource.manager.save(question);

    await expect(dataSource.manager.count(Category)).resolves.toBe(0);
    await expect(dataSource.manager.count(Question)).resolves.toBe(1);
  });
});
