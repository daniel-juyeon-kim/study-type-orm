import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { A } from "./a.entity";

@Entity()
export class B {
  @PrimaryColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToOne(() => A, (a) => a.b)
  @JoinColumn()
  a!: A;
}
