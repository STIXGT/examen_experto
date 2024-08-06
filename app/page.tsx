"use client"
import React, { useState, FormEvent } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const questions = [
  { id: 'weight', question: '¿Cuál es tu peso actual?', type: 'number' },
  { id: 'exercise', question: '¿Cuántas horas haces ejercicio al día?', type: 'number' },
  { id: 'goal', question: '¿Con este tratamiento buscas resultados estéticos o de salud?', type: 'radio', options: ['Estéticos', 'Salud'] },
  { id: 'idealWeight', question: '¿Cuál sería tu peso ideal?', type: 'number' },
  { id: 'commitment', question: '¿Estás dispuesto a comprometerte para conseguir tus objetivos?', type: 'radio', options: ['Sí', 'No'] },
];

const dietPlans = {
  lowCommitment: {
    name: 'Plan Básico',
    description: 'Un plan suave para empezar con cambios pequeños.',
    meals: [
      'Lunes: Desayuno - Avena con frutas, Almuerzo - Ensalada de pollo, Cena - Pescado al horno con verduras',
      'Martes: Desayuno - Tostadas integrales con aguacate, Almuerzo - Sopa de verduras, Cena - Pechuga de pavo a la plancha',
      'Miércoles: Desayuno - Yogur con granola, Almuerzo - Wrap de vegetales, Cena - Tortilla de espinacas',
      'Jueves: Desayuno - Batido de frutas, Almuerzo - Ensalada de atún, Cena - Pollo al curry con arroz integral',
      'Viernes: Desayuno - Pan integral con huevos revueltos, Almuerzo - Pasta integral con verduras, Cena - Salmón a la parrilla',
      'Sábado: Desayuno - Pancakes de avena, Almuerzo - Hamburguesa de lentejas, Cena - Revuelto de tofu',
      'Domingo: Desayuno - Frutas variadas, Almuerzo - Quinoa con verduras, Cena - Pechuga de pollo a las hierbas'
    ]
  },
  mediumCommitment: {
    name: 'Plan Intermedio',
    description: 'Un plan equilibrado para quienes buscan resultados moderados.',
    meals: [
      'Lunes: Desayuno - Smoothie proteico, Almuerzo - Pechuga de pollo con ensalada, Cena - Sopa de lentejas',
      'Martes: Desayuno - Omelette de claras, Almuerzo - Ensalada de quinoa, Cena - Pescado al papillote',
      'Miércoles: Desayuno - Tostadas de centeno con pavo, Almuerzo - Bowl de arroz integral con pollo y verduras, Cena - Tofu salteado',
      'Jueves: Desayuno - Yogur griego con frutos secos, Almuerzo - Wrap de pavo y aguacate, Cena - Salmón con espárragos',
      'Viernes: Desayuno - Batido verde, Almuerzo - Ensalada de garbanzos, Cena - Pechuga de pollo a la plancha con brócoli',
      'Sábado: Desayuno - Tortilla de claras con espinacas, Almuerzo - Atún a la plancha con ensalada, Cena - Sopa de verduras',
      'Domingo: Desayuno - Avena con proteína en polvo, Almuerzo - Pavo a la plancha con vegetales, Cena - Pescado blanco al horno'
    ]
  },
  highCommitment: {
    name: 'Plan Intensivo',
    description: 'Un plan riguroso para quienes buscan resultados rápidos y están muy comprometidos.',
    meals: [
      'Lunes: Desayuno - Claras de huevo con espinacas, Almuerzo - Pechuga de pollo y brócoli al vapor, Cena - Pescado a la plancha con ensalada',
      'Martes: Desayuno - Batido de proteínas con espinacas, Almuerzo - Atún a la plancha con ensalada mixta, Cena - Tofu salteado con vegetales',
      'Miércoles: Desayuno - Avena con proteína en polvo, Almuerzo - Pavo a la plancha con espárragos, Cena - Salmón al horno con calabacín',
      'Jueves: Desayuno - Tortilla de claras con champiñones, Almuerzo - Ensalada de pollo con aguacate, Cena - Lentejas con verduras',
      'Viernes: Desayuno - Yogur griego con semillas de chía, Almuerzo - Filete de ternera con ensalada, Cena - Revuelto de claras con espinacas',
      'Sábado: Desayuno - Batido proteico con frutas del bosque, Almuerzo - Pechuga de pavo con verduras a la plancha, Cena - Merluza al vapor',
      'Domingo: Desayuno - Pan proteico con claras revueltas, Almuerzo - Pollo a la plancha con ensalada, Cena - Tortilla de claras con vegetales'
    ]
  }
};

const defaultPlan = dietPlans.mediumCommitment;

const DietExpertSystem = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string | number }>({});
  const [recommendedPlan, setRecommendedPlan] = useState(defaultPlan);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');

  const handleAnswer = (answer: string | number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: answer };
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      recommendDietPlan(newAnswers);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (questions[currentQuestion].type === 'number' && currentAnswer !== '') {
      handleAnswer(parseFloat(currentAnswer));
    }
  };

  const recommendDietPlan = (finalAnswers: { [key: string]: string | number }) => {
    const weight = Number(finalAnswers.weight) || 0;
    const exercise = Number(finalAnswers.exercise) || 0;
    const goal = String(finalAnswers.goal) || 'Salud';
    const idealWeight = Number(finalAnswers.idealWeight) || 0;
    const commitment = String(finalAnswers.commitment) || 'No';

    let plan;

    if (commitment === 'No' || exercise < 1) {
      plan = dietPlans.lowCommitment;
    } else if (goal === 'Salud' && Math.abs(weight - idealWeight) < 10) {
      plan = dietPlans.mediumCommitment;
    } else if (goal === 'Estéticos' || Math.abs(weight - idealWeight) >= 10) {
      plan = dietPlans.highCommitment;
    } else {
      plan = dietPlans.mediumCommitment;
    }

    setRecommendedPlan(plan);
    setCurrentQuestion(questions.length); // Asegura que se muestre la recomendación
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <h2 className="text-2xl font-bold">{question.question}</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {question.type === 'number' ? (
              <Input
                type="number"
                placeholder="Ingresa tu respuesta"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
              />
            ) : (
              <RadioGroup onValueChange={(value) => handleAnswer(value)}>
                {question.options?.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            {question.type === 'number' && (
              <Button type="submit" className="mt-4">
                {currentQuestion < questions.length - 1 ? 'Siguiente' : 'Finalizar'}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    );
  };

  const renderRecommendation = () => (
    <Card className="w-[350px]">
      <CardHeader>
        <h2 className="text-2xl font-bold">{recommendedPlan.name}</h2>
      </CardHeader>
      <CardContent>
        <p>{recommendedPlan.description}</p>
        <h3 className="mt-4 font-semibold">Plan semanal:</h3>
        <ul className="list-disc pl-5">
          {recommendedPlan.meals.map((meal, index) => (
            <li key={index}>{meal}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full">
        {currentQuestion < questions.length ? renderQuestion() : renderRecommendation()}
      </div>
    </div>
  );
};

export default DietExpertSystem;