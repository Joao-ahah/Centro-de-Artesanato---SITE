import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Caminho para a pasta de uploads
const uploadDir = join(process.cwd(), 'public', 'uploads');

// Tamanho máximo de arquivo aceito (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB em bytes

// Tipos de arquivos aceitos
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    // Garantir que a pasta de uploads existe
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Usar a FormData API do Next.js para processar uploads multipart/form-data
    const formData = await request.formData();
    
    // Encontrar o arquivo na requisição
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      );
    }
    
    // Validar tipo de arquivo
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Tipo de arquivo não permitido. Envie apenas imagens (JPEG, PNG, WEBP, GIF).' },
        { status: 400 }
      );
    }
    
    // Validar tamanho do arquivo
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'Arquivo muito grande. O tamanho máximo permitido é 5MB.' },
        { status: 400 }
      );
    }
    
    // Gerar nome de arquivo único para evitar colisões
    const fileExtension = file.name.split('.').pop() || '';
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);
    
    // Converter o arquivo para ArrayBuffer e escrever no sistema de arquivos
    const buffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(buffer));
    
    // Gerar URL relativa para o arquivo
    const fileUrl = `/uploads/${fileName}`;
    
    return NextResponse.json({
      success: true,
      imageUrls: [fileUrl],
      message: 'Arquivo enviado com sucesso'
    });
    
  } catch (error: any) {
    console.error('Erro no upload do arquivo:', error);
    return NextResponse.json(
      { success: false, message: `Erro ao processar upload: ${error.message}` },
      { status: 500 }
    );
  }
}

// Definir tamanho máximo de payload aceito
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb',
  },
}; 