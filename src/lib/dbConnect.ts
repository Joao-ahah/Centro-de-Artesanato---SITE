import mongoose from 'mongoose';

// Tipo para o objeto de cache global
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Variáveis globais para controlar o estado da conexão
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/centro-artesanato';

// Declaração para o global
declare global {
  var mongoose: MongooseCache;
}

// Cache da conexão para manter durante o hot reload
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Função para conectar ao MongoDB
async function dbConnect() {
  // Se já existe uma conexão, retorna ela
  if (cached.conn) {
    return cached.conn;
  }

  // Se não tem uma promessa de conexão em andamento, cria uma
  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
    };

    // Tentar conectar ao MongoDB
    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('✅ Conectado ao MongoDB com sucesso');
        return mongoose;
      });
    } catch (error) {
      console.error('❌ Erro ao conectar ao MongoDB:', error);
      throw error;
    }
  }

  // Aguarda a promessa de conexão ser resolvida
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error('❌ Falha ao estabelecer conexão com MongoDB:', error);
    throw error;
  }

  return cached.conn;
}

// Exporta a função de conexão
export default dbConnect; 