import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Detail {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  detail!: string;

  @OneToOne(() => Product, (product) => product.detail, {
    cascade: ["insert"],
  })
  @JoinColumn()
  product!: Product;
}
