import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/entities';
import { PlanQuestionOptionEntity } from 'src/entities/master-data';
import {
  PlanQuestionEntity,
  PlanQuestionType,
} from 'src/entities/master-data/plan-question.entity';
import {
  BillingCycle,
  PricingPlanEntity,
} from 'src/entities/master-data/pricing-plans.entity';
import { ReceivingBankEntity } from 'src/entities/master-data/receiving-banks.entity';
import {
  PlanQuestionOptionRepository,
  PlanQuestionRepository,
  PricingPlanRepository,
  ReceivingBankRepository,
} from 'src/repositories/master-data.repository';
import { Not } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SepayService } from '../se-pay/sepay.service';
import {
  CreatePlanQuestionDto,
  UpdatePlanQuestionDto,
  UpdatePlanQuestionOptionDto,
} from './dto/create-plan-question.dto';
import {
  CreatePricingPlanDto,
  UpdatePricingPlanDto,
} from './dto/create-pricing-plan.dto';
import {
  CreateReceivingBankDto,
  UpdateReceivingBankDto,
} from './dto/create-receiving-bank.dto';

@Injectable()
export class MasterDataService {
  constructor(
    public readonly configService: ConfigService,
    private readonly pricingPlanRepo: PricingPlanRepository,
    private readonly receivingBankRepo: ReceivingBankRepository,
    private readonly planQuestionRepo: PlanQuestionRepository,
    private readonly planQuestionOptionRepo: PlanQuestionOptionRepository,
    private readonly sepayService: SepayService,
  ) {}

  //#region pricing plan
  async subscriptionPlan(user: UserEntity, pricingPlanId: string) {
    return await this.sepayService.createUserSubscriptionTransaction(user, {
      pricingPlanId: pricingPlanId,
    });
  }

  async getAllPlans(): Promise<PricingPlanEntity[]> {
    return await this.pricingPlanRepo.find({
      where: {},
      order: { displayOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async getPlanById(id: string): Promise<PricingPlanEntity> {
    const plan = await this.pricingPlanRepo.findOne({
      where: { id, isActive: true },
    });
    if (!plan) {
      throw new Error(`Pricing plan with ID ${id} not found or inactive.`);
    }
    return plan;
  }

  async initData(): Promise<{
    message: string;
  }> {
    return this.receivingBankRepo.manager.transaction(async (trans) => {
      const planQuestionOptionRepo = trans.getRepository(
        PlanQuestionOptionEntity,
      );
      const planQuestionRepo = trans.getRepository(PlanQuestionEntity);
      const pricingPlanRepo = trans.getRepository(PricingPlanEntity);
      const receivingBankRepo = trans.getRepository(ReceivingBankEntity);
      const testPlan = pricingPlanRepo.create({
        name: 'Premium Plan',
        planCode: 'premium_monthly',
        description:
          'Access to all premium features, including unlimited trips and advanced analytics.',
        price: 100000,
        currency: 'VND',
        billingCycle: BillingCycle.MONTHLY,
        features: ['Unlimited Trips', 'Advanced Analytics', 'Priority Support'],
        isActive: true,
        trialPeriodDays: 7,
        displayOrder: 1,
        limits: {
          maxTripsPerMonth: 10,
          maxCollaboratorsPerTrip: 5,
        },
      });
      await pricingPlanRepo.insert(testPlan);

      // add master data for bank
      const receivingBank = new ReceivingBankEntity();
      receivingBank.bankName = 'TpBank';
      receivingBank.bankCode = 'TPB';
      receivingBank.accountNumber = '05677267222';
      receivingBank.accountHolderName = 'TRAN HUU TAI';
      receivingBank.branchName = 'TP Ho Chi Minh';
      receivingBank.currency = 'VND';
      receivingBank.isActive = true;
      await receivingBankRepo.insert(receivingBank);

      // add plan questions dto
      const planQuestions = [
        {
          type: PlanQuestionType.SINGLE_CHOICE,
          question: 'Who is going?',
          options: [
            {
              label: 'Only me',
              desc: 'Traveling around alone!',
              icon: '🧍',
              value: 'only_me',
            },
            {
              label: 'Couple',
              desc: 'Traveling with a partner',
              icon: '👫',
              value: 'couple',
            },
            {
              label: 'Family',
              desc: 'Traveling with family',
              icon: '👨‍👩‍👧‍👦',
              value: 'family',
            },
            {
              label: 'Friends',
              desc: 'Traveling with friends',
              icon: '🧑‍🤝‍🧑',
              value: 'friends',
            },
            {
              label: 'Work',
              desc: 'Traveling with a work group',
              icon: '💼',
              value: 'Work_Group',
            },
          ],
        },
        {
          type: PlanQuestionType.MULTI_CHOICE,
          question:
            'During which time of the day do you prefer to go out when traveling?',
          options: [
            {
              label: '05:00 – 15:00',
              desc: 'Start early and finish in the afternoon',
              icon: '🌅',
              value: '05:00-15:00',
            },
            {
              label: '05:00 – 22:00',
              desc: 'From sunrise to late evening',
              icon: '☀️🌙',
              value: '05:00-22:00',
            },
            {
              label: '09:00 – 22:00',
              desc: 'Relaxed morning start to night',
              icon: '🌤️🌙',
              value: '09:00-22:00',
            },
            {
              label: '11:00 – 23:00',
              desc: 'Late start and end the day late',
              icon: '🌞🌃',
              value: '11:00-23:00',
            },
          ],
        },
        {
          type: PlanQuestionType.DATE_RANGE,
          question: 'We will your trip begin and end?',
        },
        {
          type: PlanQuestionType.SINGLE_CHOICE,
          question: 'Set your trip budget',
          options: [
            {
              label: 'Cheap',
              desc: 'I am on a budget',
              icon: '💰',
              value: 'cheap',
            },
            {
              label: 'Moderate',
              desc: 'I can spend a little more',
              icon: '💵',
              value: 'moderate',
            },
            {
              label: 'Luxury',
              desc: 'I want to enjoy the best',
              icon: '💎',
              value: 'luxury',
            },
            {
              label: 'Flexible',
              desc: "I don't have a specific budget",
              icon: '💳',
              value: 'flexible',
            },
          ],
        },
        {
          type: PlanQuestionType.MULTI_CHOICE,
          question: 'What are your interests?',
          options: [
            {
              label: 'Adventure',
              desc: 'I love adventure and outdoor activities',
              icon: '🏞️',
              value: 'adventure',
            },
            {
              label: 'Culture',
              desc: 'I enjoy learning about different cultures',
              icon: '🏛️',
              value: 'culture',
            },
            {
              label: 'Food',
              desc: 'I love trying new foods and cuisines',
              icon: '🍽️',
              value: 'food',
            },
            {
              label: 'Relaxation',
              desc: 'I want to relax and unwind',
              icon: '🏖️',
              value: 'relaxation',
            },
          ],
        },
      ];

      let index = 0;
      for (const pq of planQuestions) {
        const { options, ...questionData } = pq;
        const questionEntity = new PlanQuestionEntity();
        questionEntity.id = uuidv4();
        questionEntity.question = questionData.question;
        questionEntity.type = questionData.type;
        questionEntity.order = index++;

        await planQuestionRepo.insert(questionEntity);
        if (options && options.length > 0) {
          const optionEntities = new PlanQuestionOptionEntity();
          optionEntities.questionId = questionEntity.id;
          for (const opt of options) {
            optionEntities.id = uuidv4();
            optionEntities.label = opt.label;
            optionEntities.desc = opt.desc;
            optionEntities.icon = opt.icon;
            optionEntities.value = opt.value;
            optionEntities.question = questionEntity;
            await planQuestionOptionRepo.insert(optionEntities);
          }
        }
      }
      return {
        message: 'Pricing plan service initialized successfully',
      };
    });
  }
  async createPricingPlan(data: CreatePricingPlanDto) {
    const plan = new PricingPlanEntity();
    plan.name = data.name;
    plan.planCode = data.planCode;
    plan.description = data.description || '';
    plan.price = data.price;
    plan.currency = data.currency;
    plan.billingCycle = data.billingCycle;
    plan.features = data?.features;
    plan.isActive = data.isActive !== undefined ? data.isActive : false;
    plan.trialPeriodDays =
      data.trialPeriodDays !== undefined ? data.trialPeriodDays : 0;
    plan.displayOrder = data.displayOrder || 0;
    plan.limits = data.limits || {};
    plan.createdAt = new Date();
    return this.pricingPlanRepo.save(plan);
  }

  async getPricingPlanById(id: string) {
    const plan = await this.pricingPlanRepo.findOne({ where: { id } });
    if (!plan) throw new NotFoundException('Pricing plan not found');
    return plan;
  }
  async updatePricingPlan(id: string, data: UpdatePricingPlanDto) {
    const plan = await this.getPricingPlanById(id);
    if (!plan) {
      throw new NotFoundException('Pricing plan not found');
    }
    const update = {
      name: data.name || plan.name,
      planCode: data.planCode || plan.planCode,
      description: data.description || plan.description,
      price: data.price || plan.price,
      currency: data.currency || plan.currency,
      billingCycle: data.billingCycle || plan.billingCycle,
      features: data.features,
      isActive: data.isActive !== undefined ? data.isActive : plan.isActive,
      trialPeriodDays:
        data.trialPeriodDays !== undefined
          ? data.trialPeriodDays
          : plan.trialPeriodDays,
      displayOrder: data.displayOrder || plan.displayOrder,
      limits: data.limits || plan.limits,
      updatedAt: new Date(),
    };

    return await this.pricingPlanRepo.update(id, update);
  }
  async deletePricingPlan(id: string) {
    const plan = await this.getPricingPlanById(id);

    await this.pricingPlanRepo.update(
      { id: plan.id },
      { isActive: false, updatedAt: new Date(), updatedBy: plan.updatedBy },
    );
    return { message: 'Stop successfully!' };
  }

  //#endregion pricing plan

  //#region receiving bank
  async createReceivingBank(data: CreateReceivingBankDto) {
    const bank = new ReceivingBankEntity();
    bank.bankName = data.bankName;
    bank.bankCode = data.bankCode;
    bank.accountNumber = data.accountNumber;
    bank.accountHolderName = data.accountHolderName;
    bank.branchName = data.branchName;
    bank.currency = data.currency;
    bank.isActive = false;
    bank.createdBy = data.createdBy;
    bank.createdAt = new Date();
    await this.receivingBankRepo.insert(bank);
    return {
      message: 'Receiving bank created successfully',
      ...bank,
      updatedAt: new Date(),
      updatedBy: data.updatedBy || data.createdBy,
    };
  }
  async getAllReceivingBanks() {
    return this.receivingBankRepo.find({
      order: { isActive: 'DESC', createdAt: 'DESC' },
    });
  }
  async getReceivingBankById(id: string) {
    const bank = await this.receivingBankRepo.findOne({ where: { id } });
    if (!bank) throw new NotFoundException('Receiving bank not found');
    return bank;
  }
  async updateReceivingBank(id: string, data: UpdateReceivingBankDto) {
    const bank = await this.getReceivingBankById(id);
    if (!bank) {
      throw new NotFoundException('Receiving bank not found');
    }
    // neu la is active thi kiem tra xem có bank nao khac active khong
    if (data.isActive) {
      const activeBank = await this.receivingBankRepo.findOne({
        where: { isActive: true, id: Not(id) },
      });
      if (activeBank) {
        throw new Error('There is already an active receiving bank.');
      }
    }
    await this.receivingBankRepo.update(id, {
      bankName: data.bankName || bank.bankName,
      bankCode: data.bankCode || bank.bankCode,
      accountNumber: data.accountNumber || bank.accountNumber,
      accountHolderName: data.accountHolderName || bank.accountHolderName,
      branchName: data.branchName || bank.branchName,
      currency: data.currency || bank.currency,
      isActive: data.isActive !== undefined ? data.isActive : bank.isActive,
      updatedAt: new Date(),
      updatedBy: data.updatedBy || bank.updatedBy,
    });
    return {
      message: 'Receiving bank updated successfully',
      ...bank,
      ...data,
      updatedAt: new Date(),
      updatedBy: data.updatedBy || bank.updatedBy,
    };
  }
  async deleteReceivingBank(id: string) {
    const bank = await this.getReceivingBankById(id);
    await this.receivingBankRepo.update(id, {
      isActive: false,
      updatedAt: new Date(),
      updatedBy: bank.updatedBy,
    });
    return { message: 'Deleted successfully!' };
  }
  //#endregion receiving bank

  //#region plan question
  async updatePlanQuestionOptions(
    id: string,
    data: UpdatePlanQuestionOptionDto,
  ): Promise<{
    message: string;
  }> {
    const option = await this.planQuestionOptionRepo.findOne({ where: { id } });
    if (!option) throw new NotFoundException('Option not found');
    await this.planQuestionOptionRepo.update(id, {
      label: data.label || option.label,
      desc: data.desc || option.desc,
      icon: data.icon || option.icon,
      value: data.value || option.value,
      updatedAt: new Date(),
    });
    return {
      message: 'Option updated successfully',
      ...option,
      ...data,
    };
  }
  async deleteOption(id: string): Promise<{ message: string }> {
    const option = await this.planQuestionOptionRepo.findOne({ where: { id } });
    if (!option) throw new NotFoundException('Option not found');
    await this.planQuestionOptionRepo.remove(option);
    return { message: 'Deleted successfully!' };
  }
  async createPlanQuestionOption(data: UpdatePlanQuestionOptionDto): Promise<{
    message: string;
  }> {
    const option = new PlanQuestionOptionEntity();
    if (!data.questionId) {
      throw new Error(
        'questionId is required to create a plan question option',
      );
    }
    option.id = uuidv4();
    option.label = data.label;
    option.desc = data.desc || '';
    option.icon = data.icon || '';
    option.value = data.value;
    option.questionId = data.questionId;
    await this.planQuestionOptionRepo.insert(option);
    return {
      message: 'Option created successfully',
    };
  }
  async createPlanQuestion(data: CreatePlanQuestionDto): Promise<{
    message: string;
  }> {
    const question = new PlanQuestionEntity();
    question.id = uuidv4();
    question.question = data.question;
    question.type = data.type;
    question.order = data.order || 0;
    question.isDeleted = data.isActive !== undefined ? data.isActive : false;
    question.createdAt = new Date();

    await this.planQuestionRepo.insert(question);

    return {
      message: 'Plan question created successfully',
      ...question,
    };
  }
  async getAllPlanQuestions() {
    const res = await this.planQuestionRepo.find({
      order: { order: 'ASC', createdAt: 'DESC' },
      relations: {
        options: true,
      },
    });

    for (const item of res) {
      item.options = await item.options;
    }

    return res;
  }
  async getPlanQuestionById(id: string) {
    const question = await this.planQuestionRepo.findOne({
      where: { id },
      relations: {
        options: true,
      },
    });
    if (!question) throw new NotFoundException('Plan question not found');
    question.options = await question.options;
    return question;
  }
  async updatePlanQuestion(
    id: string,
    data: UpdatePlanQuestionDto,
  ): Promise<{
    message: string;
  }> {
    const question = await this.getPlanQuestionById(id);
    if (!question) {
      throw new NotFoundException('Plan question not found');
    }
    const dataUpdate = {
      question: data.question || question.question,
      type: data.type || question.type,
      order: data.order !== undefined ? data.order : question.order,
      isDeleted:
        data.isActive !== undefined ? !data.isActive : question.isDeleted,
      updatedAt: new Date(),
    };
    await this.planQuestionRepo.update(id, dataUpdate);
    return {
      message: 'Plan question updated successfully',
      ...question,
      ...dataUpdate,
    };
  }
  async deletePlanQuestion(id: string) {
    const question = await this.getPlanQuestionById(id);
    if (!question) {
      throw new NotFoundException('Plan question not found');
    }
    await this.planQuestionRepo.update(question.id, {
      isDeleted: true,
      updatedAt: new Date(),
    });
    return { message: 'Deleted successfully!' };
  }

  async deleteOptionByOptionId(id: string): Promise<{
    message: string;
  }> {
    const option = await this.planQuestionOptionRepo.findOne({ where: { id } });
    if (!option) throw new NotFoundException('Option not found');
    await this.planQuestionOptionRepo.remove(option);
    return { message: 'Deleted successfully!' };
  }

  //#endregion
}
