import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntityCustom } from '../base.entity';
import { PlanQuestionOptionEntity } from './plan-question-options.entity';

export enum PlanQuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTI_CHOICE = 'MULTI_CHOICE',
  DATE_RANGE = 'DATE_RANGE',
}

@Entity('master_data_plan_questions')
export class PlanQuestionEntity extends BaseEntityCustom {
  @ApiProperty({ example: 'Who is going?', description: 'Nội dung câu hỏi' })
  @Column({ type: 'text' })
  question: string;

  @ApiProperty({
    enum: PlanQuestionType,
    example: PlanQuestionType.SINGLE_CHOICE,
  })
  @Column({ type: 'enum', enum: PlanQuestionType })
  type: PlanQuestionType;

  @ApiProperty({ example: 1, description: 'Thứ tự hiển thị câu hỏi' })
  @Column({ type: 'int', default: 0 })
  order: number;

  @OneToMany(() => PlanQuestionOptionEntity, (option) => option.question, {
    cascade: true,
  })
  options: PlanQuestionOptionEntity[];
}
