import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { GenerateReportDto } from './dto/generate-report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('generate')
  async generate(@Body() dto: GenerateReportDto) {
    const report = await this.reportsService.generate(dto);
    const { filePath: _fp, ...meta } = report;
    return { report: meta };
  }

  @Get(':id/download')
  download(@Param('id') id: string, @Res() res: Response) {
    const report = this.reportsService.getReport(id);
    const buffer = this.reportsService.getPdfBuffer(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${report.id}.pdf"`);
    res.send(buffer);
  }
}
