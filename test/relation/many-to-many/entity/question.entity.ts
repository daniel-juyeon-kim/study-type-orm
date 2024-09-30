import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  text!: string;

  @ManyToMany(() => Category, (category) => category.questions, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinTable()
  categories!: Category[];
}
