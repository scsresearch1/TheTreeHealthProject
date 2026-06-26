import { Injectable, NotFoundException } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';
import PDFDocument from 'pdfkit';
import { GenerateReportDto } from './dto/generate-report.dto';

export interface StoredReport {
  id: string;
  type: string;
  title: string;
  filters: Record<string, string>;
  format: string;
  status: string;
  generatedBy: string;
  createdAt: string;
  downloadUrl: string;
  filePath: string;
}

@Injectable()
export class ReportsService {
  private readonly storageDir = join(process.cwd(), 'storage', 'reports');
  private readonly reports = new Map<string, StoredReport>();

  constructor() {
    if (!existsSync(this.storageDir)) {
      mkdirSync(this.storageDir, { recursive: true });
    }
  }

  async generate(dto: GenerateReportDto): Promise<StoredReport> {
    const id = `report-${Date.now()}`;
    const title = `${this.capitalize(dto.type)} Tree Health Report`;
    const fileName = `${id}.pdf`;
    const filePath = join(this.storageDir, fileName);
    const createdAt = new Date().toISOString();

    await this.buildPdf(filePath, dto, title, createdAt);

    const report: StoredReport = {
      id,
      type: dto.type,
      title,
      filters: dto.filters ?? {},
      format: 'pdf',
      status: 'ready',
      generatedBy: dto.generatedBy,
      createdAt,
      downloadUrl: `/api/reports/${id}/download`,
      filePath,
    };

    this.reports.set(id, report);
    return report;
  }

  getReport(id: string): StoredReport {
    const report = this.reports.get(id);
    if (!report) throw new NotFoundException(`Report ${id} not found`);
    return report;
  }

  getPdfBuffer(id: string): Buffer {
    const report = this.getReport(id);
    if (!existsSync(report.filePath)) {
      throw new NotFoundException(`PDF file missing for ${id}`);
    }
    return readFileSync(report.filePath);
  }

  private capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');
  }

  private buildPdf(
    filePath: string,
    dto: GenerateReportDto,
    title: string,
    createdAt: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const stream = createWriteStream(filePath);
      doc.pipe(stream);

      doc.fontSize(20).text('The Tree Health Project', { align: 'center' });
      doc.moveDown();
      doc.fontSize(16).text(title, { align: 'center' });
      doc.fontSize(10).text(`Generated: ${new Date(createdAt).toLocaleString()}`, { align: 'center' });
      doc.moveDown();

      const trees = dto.data.trees ?? [];
      const alerts = dto.data.alerts ?? [];
      const soil = dto.data.soil_readings ?? [];
      const healthy = trees.filter((t) => t.healthStatus === 'healthy').length;

      doc.fontSize(12).text('Summary', { underline: true });
      doc.fontSize(10);
      doc.text(`Total trees: ${trees.length}`);
      doc.text(`Healthy: ${healthy} (${trees.length ? Math.round((healthy / trees.length) * 100) : 0}%)`);
      doc.text(`Open alerts: ${alerts.filter((a) => !a.acknowledged).length}`);
      doc.text(`Soil readings: ${soil.length}`);
      if (dto.filters?.zone) doc.text(`Zone filter: ${dto.filters.zone}`);
      doc.moveDown();

      doc.fontSize(12).text('Tree Inventory', { underline: true });
      doc.fontSize(9);
      trees.slice(0, 25).forEach((t) => {
        doc.text(
          `${t.treeId} · ${t.speciesName} · ${t.healthStatus} · risk ${t.riskLevel} · zone ${t.zoneId}`,
        );
      });
      if (trees.length > 25) doc.text(`… and ${trees.length - 25} more`);
      doc.moveDown();

      doc.fontSize(12).text('Alerts', { underline: true });
      doc.fontSize(9);
      alerts.slice(0, 10).forEach((a) => {
        doc.text(`[${a.severity}] ${a.title}: ${a.message}`);
      });
      doc.moveDown();

      doc.fontSize(12).text('Soil readings (sample)', { underline: true });
      doc.fontSize(9);
      soil.slice(0, 10).forEach((s) => {
        doc.text(`${s.treeId ?? s.zoneId}: moisture ${s.moisture}% · pH ${s.ph} · score ${s.healthScore}`);
      });

      doc.end();
      stream.on('finish', () => resolve());
      stream.on('error', reject);
    });
  }
}
