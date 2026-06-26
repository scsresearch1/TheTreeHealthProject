import { IsObject, IsOptional, IsString } from 'class-validator';

export class GenerateReportDto {
  @IsString()
  type!: string;

  @IsOptional()
  @IsObject()
  filters?: Record<string, string>;

  @IsString()
  generatedBy!: string;

  @IsObject()
  data!: {
    trees: Array<Record<string, unknown>>;
    alerts: Array<Record<string, unknown>>;
    soil_readings: Array<Record<string, unknown>>;
    zones: Array<Record<string, unknown>>;
  };
}
