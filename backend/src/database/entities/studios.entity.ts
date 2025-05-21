import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Session } from './sessions.entity';

@Entity()
export class Studio {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ 
    type: 'numeric', 
    precision: 10, 
    scale: 2, 
    nullable: false,
    default: 0 
  })
  price_per_hour: number;

  @OneToMany(() => Session, session => session.studio)
  sessions: Session[];
}