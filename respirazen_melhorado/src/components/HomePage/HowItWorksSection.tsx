
'use client';

import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Pause } from 'lucide-react';

const steps = [
  {
    phase: 'Inspire',
    duration: '4 segundos',
    description: 'Respire lentamente pelo nariz, expandindo o diafragma',
    icon: ArrowUp,
    color: 'from-green-400 to-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },
  {
    phase: 'Segure',
    duration: '4 segundos',
    description: 'Mantenha o ar nos pulmões, relaxando os músculos',
    icon: Pause,
    color: 'from-yellow-400 to-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
  },
  {
    phase: 'Expire',
    duration: '4 segundos',
    description: 'Libere o ar lentamente pela boca, liberando tensões',
    icon: ArrowDown,
    color: 'from-blue-400 to-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Como Funciona
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Siga o ritmo visual e respire no seu próprio tempo. Cada ciclo te leva mais fundo no relaxamento.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          {steps.map((step, index) => (
            <div key={step.phase} className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
                className={`${step.bgColor} rounded-3xl p-8 mb-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700`}
              >
                <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${step.color} mb-4`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {step.phase}
                </h3>
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-4">
                  {step.duration}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-center max-w-xs leading-relaxed">
                  {step.description}
                </p>
              </motion.div>

              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                  viewport={{ once: true }}
                  className="hidden lg:block"
                >
                  <ArrowDown className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-8" />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              🧘‍♀️ Dica Pro
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comece com sessões de 2-3 minutos e gradualmente aumente. A consistência é mais importante que a duração.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
