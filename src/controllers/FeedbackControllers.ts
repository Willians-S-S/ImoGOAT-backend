import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

import { FeedbackRepository } from '../repositories/FeedbackRepository';

const prisma = new PrismaClient();

const feedbackRepository = new FeedbackRepository();

export class FeedbackController {
  async getAllFeedbacks(req: Request, res: Response): Promise<void> {
    try {
      const feedbacks = await feedbackRepository.findAll();
      res.json(feedbacks);
    } catch (error) {
      console.error('Erro ao buscar feedbacks:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
  async getFeedbackById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const feedback = await feedbackRepository.findById(Number(id));
      if (feedback) {
        res.json(feedback);
      } else {
        res.status(404).json({ message: 'Feedback não encontrado' });
      }
    } catch (error) {
      console.error('Erro ao buscar feedback:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async createFeedback(req: Request, res: Response): Promise<void> {
    const { rating, comment, userId, immobileId } = req.body;

    if (!rating || !comment || !userId || !immobileId) {
      res.status(400).json({
        message: "Os campos 'ratting', 'comment', 'userId' e 'immobileId' são obrigatórios! "
      });
      return;
    }

    if (req.user.role !== 'user') {
      res.status(403).json({ message: 'Você não tem permissão para criar feedbacks' });
      return;
    }
    const userP = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userP || userP.role !== 'user') {
      res.status(400).json({ message: 'Usuário inválido' });
      return;
    }
    try {
      const feedback = await feedbackRepository.create({
        rating,
        comment,
        user: { connect: { id: userId } },
        immobile: { connect: { id: immobileId } }
      });
      res.status(201).json({ message: 'Feedback criado com sucesso!'});
    } catch (error) {
      console.error('Erro ao criar feedback:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async updateFeedback(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;
      const feedback = await feedbackRepository.findById(Number(id));

      if (!feedback) {
        res.status(404).json({ message: 'Feedback não encontrado' });
        return;
      }

      if (req.user.id !== feedback?.userId) {
        res.status(403).json({ message: 'Você não tem permissão para atualizar esse feedback' });
        return;
      }
      await feedbackRepository.update(Number(id), { rating, comment });
      res.status(200).json({ message: 'Feedback atualizado com sucesso' });

    } catch (error) {
      console.error('Erro ao atualizar feedback:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async deleteFeedback(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const feedback = await feedbackRepository.findById(Number(id));

      if (!feedback) {
        res.status(404).json({ message: 'Feedback não encontrado' });
        return;
      }

      if (req.user.id !== feedback?.userId) {
        res.status(403).json({ message: 'Você não tem permissão para deletar esse feedback' });
        return;
      }
      await feedbackRepository.delete(Number(id));
      res.status(200).json({ message: 'Feedback delatado com sucesso!'});

    } catch (error) {
      console.error('Erro ao deletar feedback:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}
