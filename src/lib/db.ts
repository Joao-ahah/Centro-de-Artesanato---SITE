import mongoose from 'mongoose';

// Variável para guardar o status da conexão
let isConnected = false;

const dbConnect = async () => {
  // Se já estiver conectado, retorna a conexão existente
  if (isConnected) {
    console.log('Usando conexão existente com o MongoDB');
    return;
  }

  try {
    // Verifica se a URL do MongoDB está definida
    if (!process.env.MONGODB_URI) {
      console.warn('MongoDB URI não configurado, usando dados simulados');
      return null;
    }

    // Desabilitar o modo estrito para produção
    // Em desenvolvimento, é útil para identificar erros
    const options = {
      // useNewUrlParser: true, // deprecated nas versões mais recentes
      // useUnifiedTopology: true, // deprecated nas versões mais recentes
    };

    // Tenta conectar ao MongoDB
    const connection = await mongoose.connect(process.env.MONGODB_URI, options);
    
    // Verifica se a conexão foi bem-sucedida
    isConnected = connection.connections[0].readyState === 1;
    
    console.log('Conexão com MongoDB estabelecida');
    
    return connection;
  } catch (error) {
    console.error('Erro ao conectar com MongoDB:', error);
    return null;
  }
};

export default dbConnect;

/**
 * Função para desconectar do MongoDB
 * Útil para testes ou quando a aplicação é encerrada
 */
export async function disconnectDB() {
  if (global.mongoose.conn) {
    await mongoose.disconnect();
    global.mongoose.conn = null;
    global.mongoose.promise = null;
    console.log('Desconectado do MongoDB');
  }
} 