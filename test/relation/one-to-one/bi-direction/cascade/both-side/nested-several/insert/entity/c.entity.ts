import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { B } from "./b.entity";

@Entity()
export class C {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToOne(() => B, (b) => b.c, {
    cascade: ["insert"],
    onDelete: "CASCADE",
  })
  @JoinColumn()
  b!: B;
}
