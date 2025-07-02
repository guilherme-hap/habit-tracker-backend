import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import ReportService from '../services/reportService.js';

const router = express.Router();

export default (models) => {
    const reportService = new ReportService(models);

    router.get('/', verifyToken, async (req, res) => {
        try {
            const { format = 'json', tags, frequency, startDate, endDate } = req.query;

            const userId = req.user.id;
            const filters = { tags, frequency, startDate, endDate };
            const result = await reportService.generateHabitReport(userId, format, filters);

            if (format === 'pdf') {
                if (!result.path) {
                    throw new Error('Caminho do PDF não encontrado');
                }

                res.download(result.path, `relatorio-habitos-${userId}.pdf`, (err) => {
                    if (err) {
                        console.error('Erro ao enviar PDF:', err);
                    }
                });
            } else {
                res.json({
                    success: true,
                    data: result,
                });
            }
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Falha ao gerar relatório',
            });
        }
    });

    return router;
};
