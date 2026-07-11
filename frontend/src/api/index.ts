import axios from 'axios';
import type {
  ClassificationResult, ChangeDetectionResult,
  ModelInfo, ModelMetrics, ReportResponse, HealthStatus,
} from '../types';

const api = axios.create({ baseURL: '/api', timeout: 120_000 });

// ── Classification ────────────────────────────────────────────────────────────

export async function classifyImage(
  file: File,
  returnAnnotated = true,
): Promise<ClassificationResult> {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post<ClassificationResult>(
    `/classify?return_annotated=${returnAnnotated}`, form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
}

// ── Change Detection ──────────────────────────────────────────────────────────

export async function compareImages(
  before: File,
  after:  File,
  returnHeatmap = true,
): Promise<ChangeDetectionResult> {
  const form = new FormData();
  form.append('image_before', before);
  form.append('image_after',  after);
  const { data } = await api.post<ChangeDetectionResult>(
    `/compare?return_heatmap=${returnHeatmap}`, form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
}

// ── Model ─────────────────────────────────────────────────────────────────────

export async function getModelInfo():    Promise<ModelInfo>    { return (await api.get<ModelInfo>('/model')).data; }
export async function getModelMetrics(): Promise<ModelMetrics> { return (await api.get<ModelMetrics>('/model/metrics')).data; }

// ── Reports ───────────────────────────────────────────────────────────────────

export async function requestClassificationReport(file: File): Promise<ReportResponse> {
  const form = new FormData();
  form.append('file', file);
  return (await api.post<ReportResponse>('/reports/classification', form,
    { headers: { 'Content-Type': 'multipart/form-data' } })).data;
}

export async function requestDeforestationReport(before: File, after: File): Promise<ReportResponse> {
  const form = new FormData();
  form.append('image_before', before);
  form.append('image_after', after);
  return (await api.post<ReportResponse>('/reports/deforestation', form,
    { headers: { 'Content-Type': 'multipart/form-data' } })).data;
}

export function getReportDownloadUrl(path: string): string {
  return `/api${path}`;
}

// ── Health ────────────────────────────────────────────────────────────────────

export async function getHealth(): Promise<HealthStatus> {
  return (await api.get<HealthStatus>('/health')).data;
}
