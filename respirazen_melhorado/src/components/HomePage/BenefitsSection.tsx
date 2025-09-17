
'use client';

import { motion } from 'framer-motion';
import { Brain, Focus, Moon, Heart } from 'lucide-react';

const benefits = [
  {
    icon: Brain,
    title: 'Reduza o Estresse',
    description: 'Técnicas de respiração comprovadas para diminuir o cortisol e promover calma instantânea.',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    icon: Focus,
    title: 'Aumente o Foco',
    description: 'Melhore sua concentração e produtividade através da meditação mindfulness.',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  },
  {
    icon: Moon,
    title: 'Melhore seu Sono',
    description: 'Relaxe profundamente com práticas noturnas que preparam corpo e mente para o descanso.',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
  },
  {
    icon: Heart,
    title: 'Saúde Mental',
    description: 'Cultive bem-estar emocional e resiliência através da prática regular.',
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-50 dark:bg-rose-900/20'
  }
];

export default function BenefitsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Transforme sua Vida
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Descubra como a respiração consciente pode revolucionar seu bem-estar físico e mental
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true }}
              className={`${benefit.bgColor} rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700`}
            >
              <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${benefit.color} mb-6`}>
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
