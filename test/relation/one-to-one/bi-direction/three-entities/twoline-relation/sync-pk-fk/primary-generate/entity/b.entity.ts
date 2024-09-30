import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { A } from "./a.entity";
import { C } from "./c.entity";

@Entity()
export class B {
  @PrimaryColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToOne(() => A, (a) => a.b)
  @JoinColumn()
  a!: A;

  @OneToOne(() => C, (c) => c.b)
  c!: C;
}
