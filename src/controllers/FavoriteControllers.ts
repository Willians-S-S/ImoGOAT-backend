import { Request, Response } from 'express';
import { FavoriteRepository } from '../repositories/FavoriteRepository';
import prisma from '../../prisma/prismaClient';

const favoriteRepository = new FavoriteRepository();

export class FavoriteController {
  async addFavorite(req: Request, res: Response): Promise<void> {
    const { userId, immobileId } = req.body;
  
    if (!userId || !immobileId) {
      res.status(400).json({ message: "Os campos 'userId' e 'immobileId' são obrigatórios!" });
      return;
    }
  
    // if (req.user.role !== 'user') {
    //   res.status(403).json({ message: 'Você não tem permissão para favoritar um imóvel!' });
    //   return;
    // }
  
    const userP = await prisma.user.findUnique({
      where: { id: userId }
    });
  
    // if (!userP || userP.role !== 'user') {
    //   res.status(400).json({ message: 'Usuário inválido' });
    //   return;
    // }
  
    const immobile = await prisma.immobile.findUnique({
      where: { id: immobileId }
    });
  
    if (!immobile) {
      res.status(400).json({ message: 'Imóvel inválido' });
      return;
    }
  
    try {
      const verificaFavorite = await prisma.favorite.findUnique({
        where: {
          userId_immobileId: {
            userId,
            immobileId,
          },
        },
      });
  
      if (verificaFavorite) {
        res.status(409).json({ message: 'Imóvel já foi favoritado' });
        return;
      }
  
      await favoriteRepository.addFavorite(userId, immobileId);
      res.status(200).json({ message: 'Imóvel favoritado com sucesso' });
    } catch (error) {
      console.error('Erro ao favoritar imóvel:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  } 

  async deleteFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const favorite = await favoriteRepository.findById(Number(id));

      if (!favorite) {
        res.status(404).json({ message: 'Favorito não encontrado'});
        return;
      }

      if (req.user.id !== favorite?.userId) {
        res.status(403).json({ message: 'Você não tem permissão para deletar esse feedback' });
        return;
      }
      await favoriteRepository.delete(Number(id));
      res.status(200).json({ message: 'Favorito delatado com sucesso!'});
    } catch (error) {
      console.error('Erro ao deletar favorito:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // async deleteFavorite(req: Request, res: Response): Promise<void> {
  //   const { userId, immobileId } = req.body;
  //   if (!userId || !immobileId) {
  //     res.status(400).json({ message: "Os campos 'userId' e 'immobiledId' são obrigatórios!" });
  //     return;
  //   }

  //   if (req.user.role !== 'user' || req.user.id !== userId) {
  //     res.status(403).json({ message: 'Você não tem permissão para desfavoritar um imóvel!' });
  //     return;
  //   }

  //   const favorite = await prisma.favorite.findUnique({
  //     where: {
  //       userId_immobileId: {
  //         userId: Number(userId),
  //         immobileId: Number(immobileId),
  //       },
  //     },
  //   });

  //   if (!favorite) {
  //     res.status(404).json({ message: 'Favorito não encontrado' });
  //     return;
  //   }

  //   try {
  //     await favoriteRepository.removeFavorite(userId, immobileId);
  //     res.status(200).json({ message: 'Imóvel desfavoritado com sucesso' });
  //   } catch (error) {
  //     console.error('Erro ao desfavoritar imóvel:', error);
  //     res.status(500).json({ message: 'Erro interno do servidor' });
  //   }
  // }

  async getFavorites(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const favorites = await favoriteRepository.getFavorites(Number(userId));

      if (!favorites || favorites.length === 0) {
        res.status(404).json({ message: 'Nenhum favorito encontrado' });
        return;
      }

      res.status(200).json(favorites);
    } catch (error) {
      console.error('Erro ao buscar imóveis favoritados:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}
