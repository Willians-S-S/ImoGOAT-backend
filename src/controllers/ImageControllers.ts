import { Request, Response } from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { ImageRepository } from '../repositories/ImageRepository';

const prisma = new PrismaClient();
const imagemRepository = new ImageRepository();

interface UploadedFile extends Express.Multer.File {
  firebaseUrl?: string;
}

export class ImageController {
  async getAllImages(req: Request, res: Response): Promise<void> {
    try {
      const images = await imagemRepository.findAll();
      res.json(images);
    } catch(error) {
      console.error('Erro ao buscar imagens:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async getImageById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const images = await imagemRepository.findById(Number(id));

      if (images) {
        res.json(images);
      } else {
        res.status(404).json({ message: 'Imagem não encontrado' });
      }
    } catch(error) {
      console.error('Erro ao buscar imagens:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }

  }

  async createImage(req: Request, res: Response): Promise<void> {
    const { immobileId } = req.body;
    const files = req.files as UploadedFile[];
    const imageUrls = files.map(file => file.firebaseUrl).filter(url => url !== undefined);

    // Validação dos campos obrigatórios
    if (imageUrls.length === 0 || !immobileId) {
      res.status(400).json({
        message: "Os campos 'url' e 'immobileId' são obrigatórios"
      });
      return;
    }

    // Verifica se o usuário autenticado é um proprietário
    if (req.user.role !== 'owner') {
      res.status(403).json({ message: 'Você não tem permissão para criar imagens' });
      return;
    }

    try {
      const images = await prisma.image.createMany({
        data: imageUrls.map(url => ({
          url: url!,
          immobileId: parseInt(immobileId, 10)
        }))
      });
      res.status(200).json({ message: 'Imagens criadas com sucesso!'});
    } catch (error) {
      console.error('Erro ao criar imagem:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}
