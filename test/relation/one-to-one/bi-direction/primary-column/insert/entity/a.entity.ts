import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm";
import { B } from "./b.entity";

@Entity()
export class A {
  @PrimaryColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToOne(() => B, (b) => b.a)
  b!: B;
}
