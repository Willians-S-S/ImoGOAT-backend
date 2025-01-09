import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ImmobileRepository } from '../repositories/ImmobileRepository';

const immobileRepository = new ImmobileRepository();
const prisma = new PrismaClient();

export class ImmobileController {
  async getAllImmobiles(req: Request, res: Response): Promise<void> {
    try {
      const immobiles = await immobileRepository.findAll();
      res.json(immobiles);
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async getImmobileById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const immobile = await immobileRepository.findById(Number(id));
      if (immobile) {
        res.json(immobile);
      } else {
        res.status(404).json({ message: 'Imóvel não encontrado' });
      }
    } catch (error) {
      console.error('Erro ao buscar imóvel:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async createImmobile(req: Request, res: Response): Promise<void> {
    const {
      name,
      number,
      type,
      location,
      bairro,
      city,
      reference,
      value,
      numberOfBedrooms,
      numberOfBathrooms,
      garagem,
      description,
      proprietaryId
    } = req.body;

    if (req.user.role == 'user') {
      res.status(403).json({ message: 'Você não tem permissão para criar imóveis' });
      return;
    }

    // const owner = await prisma.user.findUnique({
    //   where: { id: Number(proprietaryId) }
    // });

    // if (!owner || owner.role !== 'owner') {
    //   res.status(400).json({ message: 'Usuário proprietário inválido' });
    //   return;
    // }

    try {
      const immobile = await prisma.immobile.create({
        data: {
          name,
          number: Number(number),
          type,
          location,
          bairro,
          city,
          reference,
          value: Number(value),
          numberOfBedrooms: Number(numberOfBedrooms),
          numberOfBathrooms: Number(numberOfBathrooms),
          garagem: Boolean(garagem),
          description,
          proprietary: {
            connect: { id: Number(proprietaryId) }
          }
        }
      });
      res.status(200).json({ message: 'Imóvel criado com sucesso! '});
    } catch (error) {
      console.error('Erro ao criar imóvel:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async updateImmobile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        name,
        number,
        type,
        location,
        bairro,
        city,
        reference,
        value,
        numberOfBedrooms,
        numberOfBathrooms,
        garagem,
        description
      } = req.body;
  
      const immobile = await immobileRepository.findById(Number(id));
  
      if (!immobile) {
        res.status(404).json({ message: 'Imóvel não encontrado' });
        return;
      }
  
      if (req.user.id !== immobile.proprietaryId) {
        res.status(403).json({ message: 'Você não tem permissão para atualizar este imóvel' });
        return;
      }
  
      const updatedImmobile = await prisma.immobile.update({
        where: { id: Number(id) },
        data: {
          name,
          number: Number(number),
          type,
          location,
          bairro,
          city,
          reference,
          value: Number(value),
          numberOfBedrooms: Number(numberOfBedrooms),
          numberOfBathrooms: Number(numberOfBathrooms),
          garagem: Boolean(garagem),
          description
        },
      });
  
      res.status(200).json({ message: 'Imóvel atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar imóvel:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
  
  async deleteImmobile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const immobile = await immobileRepository.findById(Number(id));
  
      if (!immobile) {
        res.status(404).json({ message: 'Imóvel não encontrado' });
        return;
      }
  
      if (req.user.id !== immobile.proprietaryId && req.user.role !== 'admin') {
        res.status(403).json({ message: 'Você não tem permissão para deletar este imóvel' });
        return;
      }
  
      await immobileRepository.delete(Number(id));
      res.status(200).json({ message: 'Imóvel deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar imóvel:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }  
}
