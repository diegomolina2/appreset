import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Badge } from '../components/ui/badge';
import { Lightbulb, Heart, Droplets, Dumbbell, Apple, Target } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function FAQ() {
  const { t } = useTranslation();

  const faqCategories = [
    {
      id: 'intermittent-fasting',
      title: 'Intermittent Fasting',
      icon: <Target className="w-5 h-5" />,
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100',
      questions: [
        {
          q: 'What is intermittent fasting?',
          a: 'Intermittent fasting (IF) is an eating pattern that cycles between periods of fasting and eating. It focuses on when you eat rather than what you eat. Common methods include 16:8 (16 hours fasting, 8 hours eating) and 5:2 (eating normally 5 days, restricting calories 2 days).'
        },
        {
          q: 'Is intermittent fasting safe for everyone?',
          a: 'While IF can be beneficial for many people, it\'s not suitable for everyone. Pregnant women, children, people with eating disorders, diabetes, or other medical conditions should consult healthcare providers before starting. Always listen to your body and stop if you feel unwell.'
        },
        {
          q: 'What can I drink during fasting periods?',
          a: 'During fasting periods, stick to water, black coffee, and plain tea. These don\'t break your fast. Avoid adding sugar, milk, or artificial sweeteners. Staying hydrated is crucial during fasting periods.'
        },
        {
          q: 'How long should I fast?',
          a: 'Beginners should start with shorter fasting periods like 12 hours and gradually increase. The 16:8 method is popular and manageable for most people. Never fast for more than 24 hours without medical supervision.'
        }
      ]
    },
    {
      id: 'hydration',
      title: 'Hydration & Water Intake',
      icon: <Droplets className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
      questions: [
        {
          q: 'How much water should I drink daily?',
          a: 'A general guideline is 8 glasses (2 liters) per day, but individual needs vary based on weight, activity level, and climate. A simple formula is 35ml per kg of body weight. More active individuals or those in hot climates need more.'
        },
        {
          q: 'Can I count other beverages toward my water intake?',
          a: 'Water is best, but herbal teas and diluted fruit juices can contribute. However, caffeinated drinks and alcohol can be dehydrating. Fruits and vegetables with high water content (watermelon, cucumbers) also help with hydration.'
        },
        {
          q: 'What are signs of dehydration?',
          a: 'Common signs include thirst, dry mouth, fatigue, dizziness, dark yellow urine, and headaches. Severe dehydration can cause confusion, rapid heartbeat, and fainting. If you experience severe symptoms, seek medical attention.'
        },
        {
          q: 'When is the best time to drink water?',
          a: 'Drink water throughout the day rather than large amounts at once. Start with a glass upon waking, drink before meals, and sip regularly during exercise. Listen to your body\'s thirst signals.'
        }
      ]
    },
    {
      id: 'exercise',
      title: 'Exercise & Fitness',
      icon: <Dumbbell className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
      questions: [
        {
          q: 'How often should I exercise?',
          a: 'Aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity per week, plus strength training twice a week. Start slowly if you\'re a beginner and gradually increase intensity and duration.'
        },
        {
          q: 'Can I exercise at home without equipment?',
          a: 'Absolutely! Bodyweight exercises like push-ups, squats, lunges, and planks are very effective. Our exercise library includes many home-friendly options that require no equipment. Consistency matters more than having fancy equipment.'
        },
        {
          q: 'What should I do if I feel pain during exercise?',
          a: 'Stop immediately if you feel sharp or severe pain. Mild muscle fatigue is normal, but pain in joints or sharp, shooting pains are warning signs. Rest, ice if needed, and consult a healthcare provider if pain persists.'
        },
        {
          q: 'How do I stay motivated to exercise regularly?',
          a: 'Set realistic goals, track your progress, find activities you enjoy, and create a routine. Having an exercise buddy or joining challenges (like ours!) can provide accountability. Celebrate small victories along the way.'
        }
      ]
    },
    {
      id: 'nutrition',
      title: 'Healthy Eating & Nutrition',
      icon: <Apple className="w-5 h-5" />,
      color: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      questions: [
        {
          q: 'What makes West African cuisine healthy?',
          a: 'Traditional West African meals are rich in nutrients from vegetables, legumes, whole grains, and lean proteins. Foods like plantains provide potassium, leafy greens offer iron and vitamins, and fermented foods support gut health. Focus on traditional preparation methods and fresh ingredients.'
        },
        {
          q: 'How can I reduce sugar in my diet?',
          a: 'Start by reading food labels and identifying hidden sugars. Replace sugary drinks with water or herbal teas. Choose whole fruits over fruit juices. Gradually reduce sugar in cooking and baking. Use natural sweeteners like dates or honey sparingly.'
        },
        {
          q: 'What are the best snacks for weight loss?',
          a: 'Choose protein-rich and fiber-rich snacks that keep you full longer. Examples include nuts, seeds, Greek yogurt, fruits with nut butter, or vegetables with hummus. Traditional options like roasted plantain chips (in moderation) or tiger nuts are also good choices.'
        },
        {
          q: 'How do I control portion sizes?',
          a: 'Use smaller plates, fill half your plate with vegetables, quarter with lean protein, and quarter with whole grains. Listen to hunger cues and eat slowly. Traditional African eating practices often emphasize mindful eating and sharing meals.'
        }
      ]
    },
    {
      id: 'wellness',
      title: 'General Wellness',
      icon: <Heart className="w-5 h-5" />,
      color: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
      questions: [
        {
          q: 'How important is sleep for weight loss?',
          a: 'Sleep is crucial for weight management. Poor sleep affects hormones that control hunger and satiety, leading to increased appetite and cravings. Aim for 7-9 hours of quality sleep per night. Create a bedtime routine and avoid screens before sleep.'
        },
        {
          q: 'How do I manage stress while trying to be healthy?',
          a: 'Chronic stress can sabotage health goals by triggering emotional eating and elevating cortisol levels. Practice stress management through exercise, meditation, deep breathing, or talking to friends and family. Traditional practices like drumming or dancing can also help.'
        },
        {
          q: 'What if I miss a day in my challenge?',
          a: 'Don\'t let one missed day derail your entire journey. Acknowledge it, understand why it happened, and get back on track the next day. Challenges are about building long-term habits, not achieving perfection. Progress, not perfection, is the goal.'
        },
        {
          q: 'How long before I see results?',
          a: 'Results vary by individual and goals. You might feel more energetic within days, see weight changes in 2-4 weeks, and notice significant improvements in 6-12 weeks. Focus on how you feel rather than just the scale. Non-scale victories are equally important.'
        }
      ]
    }
  ];

  const tips = [
    {
      title: 'Start Small',
      description: 'Begin with small, manageable changes rather than dramatic overhauls. This makes habits more sustainable.',
      icon: <Target className="w-6 h-6 text-blue-500" />
    },
    {
      title: 'Stay Consistent',
      description: 'Consistency beats perfection. Small daily actions compound into significant results over time.',
      icon: <Heart className="w-6 h-6 text-red-500" />
    },
    {
      title: 'Listen to Your Body',
      description: 'Pay attention to hunger cues, energy levels, and how different foods make you feel.',
      icon: <Lightbulb className="w-6 h-6 text-yellow-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-poppins font-bold text-gray-800 dark:text-gray-100">
            FAQ & Health Tips
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Evidence-based guidance for your wellness journey
          </p>
        </div>
      </header>

      <div className="px-4 py-6">
        {/* Quick Tips */}
        <div className="mb-8">
          <h2 className="text-xl font-poppins font-bold text-gray-800 dark:text-gray-100 mb-4">
            Quick Tips
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {tips.map((tip, index) => (
              <Card key={index} className="p-4">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-3 mb-2">
                    {tip.icon}
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                      {tip.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tip.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {faqCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  {category.icon}
                  <span>{category.title}</span>
                  <Badge className={category.color}>
                    {category.questions.length} questions
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`${category.id}-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 dark:text-gray-400">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <Card className="mt-8 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Important Disclaimer
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  The information provided here is for educational purposes only and should not replace professional medical advice. 
                  Always consult with healthcare providers before starting new diet or exercise programs, especially if you have 
                  existing health conditions. Individual results may vary.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
