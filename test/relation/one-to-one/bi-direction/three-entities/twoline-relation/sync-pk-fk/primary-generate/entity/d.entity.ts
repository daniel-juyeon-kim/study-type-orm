import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { A } from "./a.entity";
import { E } from "./e.entity";

@Entity()
export class D {
  @PrimaryColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToOne(() => A, (a) => a.d)
  @JoinColumn()
  a!: A;

  @OneToOne(() => E, (e) => e.d)
  e!: E;
}
