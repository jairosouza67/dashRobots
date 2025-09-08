import sharp from 'sharp';
import { promises as fs } from 'fs';

// Tamanhos necessários
const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// Função para criar ícones
async function createIcons() {
  try {
    // Certifique-se de que o diretório icons existe
    await fs.mkdir('public/icons', { recursive: true });

    // Crie ícones em todos os tamanhos necessários
    for (const size of sizes) {
      await sharp('public/placeholder.svg')
        .resize(size, size)
        .png()
        .toFile(`public/icons/icon-${size}x${size}.png`);
      console.log(`Criado: public/icons/icon-${size}x${size}.png`);
    }
    
    console.log('Todos os ícones foram criados com sucesso!');
  } catch (error) {
    console.error('Erro ao criar ícones:', error);
  }
}

createIcons();