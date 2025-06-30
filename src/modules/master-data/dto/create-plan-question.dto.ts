import { PlanQuestionType } from 'src/entities/master-data/plan-question.entity';

export class CreatePlanQuestionDto {
  question: string;
  type: PlanQuestionType;
  order?: number;
  isActive: boolean;
}
export class CreatePlanQuestionOptionDto {
  questionId?: string;
  label: string;
  desc?: string;
  icon?: string;
  value: string;
}
export class UpdatePlanQuestionDto extends CreatePlanQuestionDto {
  id: string;
}
export class UpdatePlanQuestionOptionDto extends CreatePlanQuestionOptionDto {
  id: string;
}
