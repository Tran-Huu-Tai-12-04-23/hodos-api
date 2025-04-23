import { Injectable } from '@nestjs/common';

@Injectable()
export class PlanTripService {
  constructor() {}

  async loadQuestionToCollect() {
    return [
      {
        type: 'SINGLE_CHOICE',
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
        type: 'DATE_RANGE',
        question: 'We will your trip begin and end?',
      },
      {
        type: 'SINGLE_CHOICE',
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
        type: 'MULTI_CHOICE',
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
  }
}
