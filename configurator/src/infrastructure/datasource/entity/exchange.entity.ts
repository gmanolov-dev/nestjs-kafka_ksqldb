import { type } from "os";
import { Column, Entity, ObjectIdColumn } from "typeorm";
import { ObjectID } from "mongodb";

@Entity()
export class ExchangeEntity {

  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  exchange: string;

  @Column()
  pairs: {[pair: string]: boolean};
}