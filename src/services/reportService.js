class ReportService {
    constructor(models) {
      this.models = models;
    }
  
    async generateHabitReport(userId, format = 'json') {
      const statsService = new (await import('./statsService.js')).default(this.models);
      const stats = await statsService.getUserStats(userId);
  
      if (format === 'pdf') {
        return this._generatePDFReport(stats);
      }
      return stats;
    }
  
    async _generatePDFReport(stats) {
      const { default: PDFDocument } = await import('pdfkit');
      const fs = await import('fs');
      const path = await import('path');
      
      const doc = new PDFDocument();
      const filePath = path.join(process.cwd(), 'temp', `report-${Date.now()}.pdf`);
      
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }
  
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      doc.fontSize(20).text('Relatório de Hábitos', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Usuário: ${userId}`);
      doc.text(`Data: ${new Date().toLocaleDateString()}`);
  
      doc.end();
  
      return new Promise((resolve) => {
        stream.on('finish', () => resolve({ path: filePath, stats }));
      });
    }
  }
  
  export default ReportService; 