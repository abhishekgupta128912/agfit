const OpenAI = require('openai');

// Initialize OpenAI client
if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
  throw new Error('OpenAI API key is required. Please set OPENAI_API_KEY in your environment variables.');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log('✅ OpenAI API initialized successfully');

class AIService {
  constructor() {
    this.model = 'gpt-3.5-turbo';
    this.maxTokens = 300;
    this.temperature = 0.7;
  }

  /**
   * Generate personalized nutrition plan based on user profile
   */
  async generateNutritionPlan(profile) {
    try {
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

      // Handle specific OpenAI errors with helpful messages
      if (error.status === 429) {
        throw new Error('OpenAI API quota exceeded. Please check your billing details or try again later.');
      } else if (error.status === 401) {
        throw new Error('OpenAI API key is invalid. Please check your API key configuration.');
      } else if (error.status === 503) {
        throw new Error('OpenAI service is temporarily unavailable. Please try again in a few minutes.');
      } else {
        throw new Error('Failed to generate nutrition plan. Please try again later.');
      }
    }
  }

  /**
   * Generate personalized workout plan based on user profile
   */
  async generateWorkoutPlan(profile) {
    try {
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

      // Handle specific OpenAI errors with helpful messages
      if (error.status === 429) {
        throw new Error('OpenAI API quota exceeded. Please check your billing details or try again later.');
      } else if (error.status === 401) {
        throw new Error('OpenAI API key is invalid. Please check your API key configuration.');
      } else if (error.status === 503) {
        throw new Error('OpenAI service is temporarily unavailable. Please try again in a few minutes.');
      } else {
        throw new Error('Failed to generate workout plan. Please try again later.');
      }
    }
  }

  /**
   * Generate wellness recommendations based on user profile
   */
  async generateWellnessPlan(profile) {
    try {
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

      // Handle specific OpenAI errors with helpful messages
      if (error.status === 429) {
        throw new Error('OpenAI API quota exceeded. Please check your billing details or try again later.');
      } else if (error.status === 401) {
        throw new Error('OpenAI API key is invalid. Please check your API key configuration.');
      } else if (error.status === 503) {
        throw new Error('OpenAI service is temporarily unavailable. Please try again in a few minutes.');
      } else {
        throw new Error('Failed to generate wellness plan. Please try again later.');
      }
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
}

module.exports = new AIService();
