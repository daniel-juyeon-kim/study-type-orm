import { createDataSource, initializeDataSource } from "../../../../../../../data-source";
import { Detail } from "./entity/detail.entity";
import { Order } from "./entity/order.entity";
import { Product } from "./entity/product.entity";

const dataSource = createDataSource(__dirname);

const createOrder = async () => {
  const detail = dataSource.manager.create(Detail, {
    detail: "세부사항",
  });
  await dataSource.manager.save(Detail, detail);

  const product = dataSource.manager.create(Product, {
    name: "상품이름",
    detail,
  });
  await dataSource.manager.save(Product, product);

  const order = dataSource.manager.create(Order, {
    name: "주문이름",
    product,
  });
  await dataSource.manager.save(Order, order);
};

beforeAll(async () => {
  await initializeDataSource(dataSource);
});

beforeEach(async () => {
  await createOrder();
});

afterEach(async () => {
  await dataSource.manager.clear(Detail);
  await dataSource.manager.clear(Product);
  await dataSource.manager.clear(Order);
});

describe("중첩된 양방향 1:1 cascade 삭제, 전부 cascade onDelete가 설정되어 있음", () => {
  test("order에서 삭제", async () => {
    await dataSource.manager.clear(Order);

    await expect(dataSource.manager.exists(Order)).resolves.toBe(false);
    await expect(dataSource.manager.exists(Product)).resolves.toBe(false);
    await expect(dataSource.manager.exists(Detail)).resolves.toBe(false);
  });

  test("product에서 삭제", async () => {
    await dataSource.manager.clear(Product);

    await expect(dataSource.manager.exists(Order)).resolves.toBe(true);
    await expect(dataSource.manager.exists(Product)).resolves.toBe(false);
    await expect(dataSource.manager.exists(Detail)).resolves.toBe(false);
  });

  test("detail에서 삭제", async () => {
    await dataSource.manager.clear(Detail);

    await expect(dataSource.manager.exists(Order)).resolves.toBe(true);
    await expect(dataSource.manager.exists(Product)).resolves.toBe(true);
    await expect(dataSource.manager.exists(Detail)).resolves.toBe(false);
  });
});
