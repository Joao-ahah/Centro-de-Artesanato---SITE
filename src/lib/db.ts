import mongoose from 'mongoose';

// Variável para guardar o status da conexão
let isConnected = false;

const dbConnect = async () => {
  // Se já estiver conectado, retorna a conexão existente
  if (isConnected) {
    console.log('Usando conexão existente com o MongoDB');
    return mongoose.connection;
  }

  try {
    // Verifica se a URL do MongoDB está definida
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI não definida no arquivo .env');
      throw new Error('MongoDB URI não configurada');
    }

    const mongoURI = process.env.MONGODB_URI;
    console.log('Conectando ao MongoDB...');

    // Tenta conectar ao MongoDB
    const connection = await mongoose.connect(mongoURI);
    
    // Verifica se a conexão foi bem-sucedida
    isConnected = connection.connections[0].readyState === 1;
    
    if (isConnected) {
      console.log('Conexão com MongoDB estabelecida com sucesso');
    } else {
      console.error('Falha ao conectar ao MongoDB. Estado da conexão:', connection.connections[0].readyState);
    }
    
    return connection;
  } catch (error) {
    console.error('Erro ao conectar com MongoDB:', error);
    throw error;
  }
};

export default dbConnect;

/**
 * Função para desconectar do MongoDB
 * Útil para testes ou quando a aplicação é encerrada
 */
export async function disconnectDB() {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('Desconectado do MongoDB');
  }
} 