const OpenAI = require('openai');

// Initialize OpenAI client with error handling
let openai = null;
let openaiAvailable = false;

try {
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    openaiAvailable = true;
    console.log('✅ OpenAI API initialized successfully');
  } else {
    console.log('⚠️  OpenAI API key not configured - using demo mode');
  }
} catch (error) {
  console.error('❌ Failed to initialize OpenAI:', error.message);
  openaiAvailable = false;
}

class AIService {
  constructor() {
    this.model = 'gpt-3.5-turbo';
    this.maxTokens = 300;
    this.temperature = 0.7;
    this.demoMode = !openaiAvailable;
  }

  /**
   * Generate personalized nutrition plan based on user profile
   */
  async generateNutritionPlan(profile) {
    try {
      // If OpenAI is not available, return demo data
      if (this.demoMode) {
        return this.getDemoNutritionPlan(profile);
      }

      const prompt = this.buildNutritionPrompt(profile);

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a certified nutritionist and health expert. Provide personalized, safe, and evidence-based nutrition recommendations. Always include disclaimers about consulting healthcare professionals.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
      });

      return this.parseNutritionResponse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error generating nutrition plan:', error);
      // Fallback to demo data if API fails
      console.log('🔄 Falling back to demo nutrition plan');
      return this.getDemoNutritionPlan(profile);
    }
  }

  /**
   * Generate personalized workout plan based on user profile
   */
  async generateWorkoutPlan(profile) {
    try {
      // If OpenAI is not available, return demo data
      if (this.demoMode) {
        return this.getDemoWorkoutPlan(profile);
      }

      const prompt = this.buildWorkoutPrompt(profile);

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a certified personal trainer and fitness expert. Provide safe, progressive, and personalized workout recommendations. Always emphasize proper form and safety.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
      });

      return this.parseWorkoutResponse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error generating workout plan:', error);
      // Fallback to demo data if API fails
      console.log('🔄 Falling back to demo workout plan');
      return this.getDemoWorkoutPlan(profile);
    }
  }

  /**
   * Generate wellness recommendations based on user profile
   */
  async generateWellnessPlan(profile) {
    try {
      // If OpenAI is not available, return demo data
      if (this.demoMode) {
        return this.getDemoWellnessPlan(profile);
      }

      const prompt = this.buildWellnessPrompt(profile);

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a wellness coach and mental health advocate. Provide holistic wellness recommendations focusing on mental health, stress management, and lifestyle improvements.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
      });

      return this.parseWellnessResponse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error generating wellness plan:', error);
      // Fallback to demo data if API fails
      console.log('🔄 Falling back to demo wellness plan');
      return this.getDemoWellnessPlan(profile);
    }
  }

  /**
   * Build nutrition prompt based on user profile
   */
  buildNutritionPrompt(profile) {
    const { personalInfo, healthGoals, activityLevel, dietaryInfo, healthConditions, lifestyle } = profile;
    
    return `Create a personalized daily meal plan for a ${personalInfo.age}-year-old ${personalInfo.gender} with the following profile:

PHYSICAL STATS:
- Height: ${personalInfo.height}cm
- Weight: ${personalInfo.weight}kg
- Activity Level: ${activityLevel}

HEALTH GOALS:
- Primary Goal: ${healthGoals.primary}
- Target Weight: ${healthGoals.targetWeight}kg
- Timeframe: ${healthGoals.timeframe}

DIETARY PREFERENCES:
- Restrictions: ${dietaryInfo.restrictions.join(', ') || 'None'}
- Allergies: ${dietaryInfo.allergies.join(', ') || 'None'}
- Meals per day: ${dietaryInfo.mealsPerDay}

HEALTH CONDITIONS:
- Existing conditions: ${healthConditions.existing.join(', ') || 'None'}
- Medications: ${healthConditions.medications.join(', ') || 'None'}

LIFESTYLE:
- Sleep: ${lifestyle.sleepHours} hours/night
- Stress Level: ${lifestyle.stressLevel}/10

Please provide:
1. Daily calorie target
2. Macronutrient breakdown (protein, carbs, fats)
3. Detailed meal plan with specific foods and portions
4. Hydration recommendations
5. Supplement suggestions (if appropriate)
6. Important safety notes and disclaimers

Format the response as structured JSON with clear sections.`;
  }

  /**
   * Build workout prompt based on user profile
   */
  buildWorkoutPrompt(profile) {
    const { personalInfo, healthGoals, activityLevel, healthConditions, lifestyle } = profile;
    
    return `Design a personalized workout routine for a ${personalInfo.age}-year-old ${personalInfo.gender} with the following profile:

PHYSICAL STATS:
- Height: ${personalInfo.height}cm
- Weight: ${personalInfo.weight}kg
- Current Activity Level: ${activityLevel}

HEALTH GOALS:
- Primary Goal: ${healthGoals.primary}
- Secondary Goals: ${healthGoals.secondary?.join(', ') || 'None'}
- Target Weight: ${healthGoals.targetWeight}kg

HEALTH CONDITIONS:
- Existing conditions: ${healthConditions.existing.join(', ') || 'None'}
- Injuries: ${healthConditions.injuries.join(', ') || 'None'}

LIFESTYLE:
- Sleep: ${lifestyle.sleepHours} hours/night
- Stress Level: ${lifestyle.stressLevel}/10

Please provide:
1. Weekly workout schedule (days and duration)
2. Specific exercises with sets, reps, and rest periods
3. Progressive overload recommendations
4. Warm-up and cool-down routines
5. Modification options for different fitness levels
6. Safety precautions and form tips
7. Recovery recommendations

Format the response as structured JSON with clear sections for each workout day.`;
  }

  /**
   * Build wellness prompt based on user profile
   */
  buildWellnessPrompt(profile) {
    const { personalInfo, lifestyle, healthConditions } = profile;
    
    return `Create a holistic wellness plan for a ${personalInfo.age}-year-old ${personalInfo.gender} with the following profile:

LIFESTYLE:
- Sleep: ${lifestyle.sleepHours} hours/night
- Stress Level: ${lifestyle.stressLevel}/10
- Smoking: ${lifestyle.smokingStatus}
- Alcohol: ${lifestyle.alcoholConsumption}

HEALTH CONDITIONS:
- Existing conditions: ${healthConditions.existing.join(', ') || 'None'}

Please provide:
1. Sleep optimization strategies
2. Stress management techniques
3. Mental health recommendations
4. Mindfulness and meditation practices
5. Social wellness suggestions
6. Work-life balance tips
7. Habit formation strategies

Format the response as structured JSON with actionable daily and weekly practices.`;
  }

  /**
   * Parse and structure nutrition response
   */
  parseNutritionResponse(response) {
    try {
      // Try to parse as JSON first
      return JSON.parse(response);
    } catch (error) {
      // If not JSON, structure the text response
      return {
        type: 'nutrition',
        content: response,
        generatedAt: new Date(),
        structured: false
      };
    }
  }

  /**
   * Parse and structure workout response
   */
  parseWorkoutResponse(response) {
    try {
      return JSON.parse(response);
    } catch (error) {
      return {
        type: 'workout',
        content: response,
        generatedAt: new Date(),
        structured: false
      };
    }
  }

  /**
   * Parse and structure wellness response
   */
  parseWellnessResponse(response) {
    try {
      return JSON.parse(response);
    } catch (error) {
      return {
        type: 'wellness',
        content: response,
        generatedAt: new Date(),
        structured: false
      };
    }
  }

  /**
   * Generate comprehensive health plan (all three types)
   */
  async generateComprehensivePlan(profile) {
    try {
      const [nutritionPlan, workoutPlan, wellnessPlan] = await Promise.all([
        this.generateNutritionPlan(profile),
        this.generateWorkoutPlan(profile),
        this.generateWellnessPlan(profile)
      ]);

      return {
        nutrition: nutritionPlan,
        workout: workoutPlan,
        wellness: wellnessPlan,
        generatedAt: new Date(),
        profileSnapshot: {
          age: profile.personalInfo.age,
          goals: profile.healthGoals.primary,
          activityLevel: profile.activityLevel
        }
      };
    } catch (error) {
      console.error('Error generating comprehensive plan:', error);
      throw new Error('Failed to generate comprehensive health plan');
    }
  }

  /**
   * Demo nutrition plan for when OpenAI is not available
   */
  getDemoNutritionPlan(profile) {
    const { personalInfo, healthGoals } = profile;
    const baseCalories = personalInfo.gender === 'male' ? 2200 : 1800;

    return {
      type: 'nutrition',
      structured: true,
      generatedAt: new Date(),
      demoMode: true,
      content: {
        dailyCalories: baseCalories,
        macronutrients: {
          protein: '25%',
          carbohydrates: '45%',
          fats: '30%'
        },
        mealPlan: {
          breakfast: {
            foods: ['Oatmeal with berries', 'Greek yogurt', 'Almonds'],
            calories: Math.round(baseCalories * 0.25)
          },
          lunch: {
            foods: ['Grilled chicken salad', 'Quinoa', 'Avocado'],
            calories: Math.round(baseCalories * 0.35)
          },
          dinner: {
            foods: ['Salmon', 'Sweet potato', 'Steamed broccoli'],
            calories: Math.round(baseCalories * 0.30)
          },
          snacks: {
            foods: ['Apple with peanut butter', 'Protein smoothie'],
            calories: Math.round(baseCalories * 0.10)
          }
        },
        hydration: '8-10 glasses of water daily',
        supplements: ['Multivitamin', 'Omega-3', 'Vitamin D'],
        notes: [
          'This is a demo nutrition plan.',
          'Please consult with a registered dietitian for personalized advice.',
          'Adjust portions based on your activity level and goals.'
        ]
      }
    };
  }

  /**
   * Demo workout plan for when OpenAI is not available
   */
  getDemoWorkoutPlan(profile) {
    const { personalInfo, healthGoals } = profile;

    return {
      type: 'workout',
      structured: true,
      generatedAt: new Date(),
      demoMode: true,
      content: {
        weeklySchedule: '3-4 days per week',
        workoutDuration: '45-60 minutes',
        workouts: {
          day1: {
            name: 'Upper Body Strength',
            exercises: [
              { name: 'Push-ups', sets: 3, reps: '10-15', rest: '60s' },
              { name: 'Dumbbell rows', sets: 3, reps: '12-15', rest: '60s' },
              { name: 'Shoulder press', sets: 3, reps: '10-12', rest: '60s' },
              { name: 'Plank', sets: 3, duration: '30-60s', rest: '60s' }
            ]
          },
          day2: {
            name: 'Lower Body & Core',
            exercises: [
              { name: 'Squats', sets: 3, reps: '12-15', rest: '60s' },
              { name: 'Lunges', sets: 3, reps: '10 each leg', rest: '60s' },
              { name: 'Glute bridges', sets: 3, reps: '15-20', rest: '60s' },
              { name: 'Dead bug', sets: 3, reps: '10 each side', rest: '60s' }
            ]
          },
          day3: {
            name: 'Cardio & Flexibility',
            exercises: [
              { name: 'Brisk walking', duration: '20-30 minutes' },
              { name: 'Dynamic stretching', duration: '10 minutes' },
              { name: 'Yoga flow', duration: '15 minutes' }
            ]
          }
        },
        progression: 'Increase reps or weight by 5-10% weekly',
        safety: [
          'This is a demo workout plan.',
          'Warm up for 5-10 minutes before exercising.',
          'Cool down and stretch after workouts.',
          'Listen to your body and rest when needed.',
          'Consult a fitness professional for personalized guidance.'
        ]
      }
    };
  }

  /**
   * Demo wellness plan for when OpenAI is not available
   */
  getDemoWellnessPlan(profile) {
    const { personalInfo, lifestyle } = profile;

    return {
      type: 'wellness',
      structured: true,
      generatedAt: new Date(),
      demoMode: true,
      content: {
        sleepOptimization: {
          targetHours: '7-9 hours',
          tips: [
            'Maintain consistent sleep schedule',
            'Create a relaxing bedtime routine',
            'Limit screen time before bed',
            'Keep bedroom cool and dark'
          ]
        },
        stressManagement: {
          techniques: [
            'Deep breathing exercises (5 minutes daily)',
            'Progressive muscle relaxation',
            'Mindfulness meditation (10-15 minutes)',
            'Regular physical activity'
          ]
        },
        mentalHealth: {
          practices: [
            'Gratitude journaling (3 things daily)',
            'Social connections with friends/family',
            'Hobby engagement',
            'Professional support when needed'
          ]
        },
        mindfulness: {
          dailyPractices: [
            'Morning intention setting (2 minutes)',
            'Mindful eating during one meal',
            'Evening reflection (5 minutes)',
            'Body scan meditation'
          ]
        },
        workLifeBalance: {
          strategies: [
            'Set clear work boundaries',
            'Take regular breaks',
            'Prioritize important tasks',
            'Schedule personal time'
          ]
        },
        habitFormation: {
          tips: [
            'Start with small, achievable goals',
            'Use habit stacking',
            'Track progress visually',
            'Celebrate small wins'
          ]
        },
        notes: [
          'This is a demo wellness plan.',
          'Mental health is just as important as physical health.',
          'Consider professional counseling if experiencing persistent stress or anxiety.',
          'Adjust recommendations based on your personal needs and circumstances.'
        ]
      }
    };
  }
}

module.exports = new AIService();
