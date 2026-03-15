import axios from "axios";
import api from "../services/api";
import { getPredictionHistoryByType, type PredictionHistory } from "../lib/MLService";

export interface ReportFilters {
  crop: string;
  startDate: string;
  endDate: string;
}

export type ReportFileFormat = "csv" | "pdf";

export type ReportEndpointHealth = "available" | "unauthorized" | "missing" | "unknown";

type BackendReportType = "transactions" | "combined";

const BACKEND_REPORT_ENDPOINTS: Record<BackendReportType, string> = {
  transactions: "/auth/admin/reports/transactions/",
  combined: "/auth/admin/reports/combined-market/",
};

const escapeCsvValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value).replace(/"/g, '""');
  return /[",\n]/.test(stringValue) ? `"${stringValue}"` : stringValue;
};

const buildCsv = (rows: Array<Record<string, unknown>>): string => {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const headerLine = headers.map(escapeCsvValue).join(",");
  const valueLines = rows.map((row) =>
    headers.map((header) => escapeCsvValue(row[header])).join(",")
  );

  return [headerLine, ...valueLines].join("\n");
};

const triggerFileDownload = (blob: Blob, filename: string) => {
  const downloadUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(downloadUrl);
};

const getFilenameFromDisposition = (
  contentDisposition: string | undefined,
  fallbackFilename: string
): string => {
  if (!contentDisposition) {
    return fallbackFilename;
  }

  const filenameMatch = contentDisposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  if (!filenameMatch?.[1]) {
    return fallbackFilename;
  }

  try {
    return decodeURIComponent(filenameMatch[1]);
  } catch {
    return filenameMatch[1];
  }
};

const normalizeDate = (dateValue: string): string => {
  if (!dateValue) {
    return "all-time";
  }

  return dateValue;
};

export const createReportFilename = (
  prefix: string,
  filters: ReportFilters,
  format: ReportFileFormat = "csv"
): string => {
  const cropPart = filters.crop === "all" ? "all-crops" : filters.crop.toLowerCase().replace(/\s+/g, "-");
  const startPart = normalizeDate(filters.startDate);
  const endPart = normalizeDate(filters.endDate);
  return `${prefix}-${cropPart}-${startPart}-to-${endPart}.${format}`;
};

const isWithinSelectedRange = (createdAt: string, filters: ReportFilters): boolean => {
  const reportDate = createdAt.slice(0, 10);

  if (filters.startDate && reportDate < filters.startDate) {
    return false;
  }

  if (filters.endDate && reportDate > filters.endDate) {
    return false;
  }

  return true;
};

const matchesSelectedCrop = (cropName: string, selectedCrop: string): boolean => {
  if (selectedCrop === "all") {
    return true;
  }

  return cropName.toLowerCase() === selectedCrop.toLowerCase();
};

const readFeatureValue = (historyItem: PredictionHistory, key: string): string => {
  const value = historyItem.input_features?.[key];
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean"
    ? String(value)
    : "";
};

const mapHistoryToCsvRow = (historyItem: PredictionHistory) => ({
  generated_at: historyItem.created_at,
  last_updated_at: historyItem.updated_at,
  crop_name: historyItem.crop_name,
  prediction_type: historyItem.prediction_type,
  predicted_price: historyItem.predicted_value,
  confidence: historyItem.confidence,
  season: readFeatureValue(historyItem, "season"),
  supply: readFeatureValue(historyItem, "supply"),
  demand: readFeatureValue(historyItem, "demand"),
  market_trend: readFeatureValue(historyItem, "market_trend"),
});

const serializeFilters = (filters: ReportFilters, format: ReportFileFormat) => ({
  ...(filters.crop !== "all" ? { crop: filters.crop } : {}),
  ...(filters.startDate ? { start_date: filters.startDate } : {}),
  ...(filters.endDate ? { end_date: filters.endDate } : {}),
  format,
});

const isHeaderOnlyCsvBlob = async (blob: Blob): Promise<boolean> => {
  const csvText = await blob.text();
  const nonEmptyLines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return nonEmptyLines.length <= 1;
};

const extractDetailFromUnknown = (value: unknown): string | null => {
  if (typeof value === "string") {
    return value.trim() || null;
  }

  if (Array.isArray(value)) {
    const details = value
      .map((item) => extractDetailFromUnknown(item))
      .filter((item): item is string => Boolean(item));
    return details.length ? details.join("; ") : null;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const prioritizedKeys = ["detail", "message", "error", "errors", "non_field_errors"];

    for (const key of prioritizedKeys) {
      const detail = extractDetailFromUnknown(record[key]);
      if (detail) {
        return detail;
      }
    }

    for (const [, nestedValue] of Object.entries(record)) {
      const detail = extractDetailFromUnknown(nestedValue);
      if (detail) {
        return detail;
      }
    }
  }

  return null;
};

const extractBadRequestDetail = async (data: unknown): Promise<string | null> => {
  if (data instanceof Blob) {
    const blobText = (await data.text()).trim();
    if (!blobText) {
      return null;
    }

    try {
      return extractDetailFromUnknown(JSON.parse(blobText)) ?? blobText;
    } catch {
      return blobText;
    }
  }

  if (typeof data === "string") {
    const trimmed = data.trim();
    if (!trimmed) {
      return null;
    }

    try {
      return extractDetailFromUnknown(JSON.parse(trimmed)) ?? trimmed;
    } catch {
      return trimmed;
    }
  }

  return extractDetailFromUnknown(data);
};

export const downloadMlPriceTrendReport = async (
  filters: ReportFilters,
  format: ReportFileFormat = "csv"
): Promise<string> => {
  try {
    if (format === "pdf") {
      throw new Error("ML Price Trends PDF is not enabled yet. Use CSV, or add a backend PDF endpoint for this report.");
    }

    const history = await getPredictionHistoryByType("price");
    const rows = history
      .filter((historyItem) => matchesSelectedCrop(historyItem.crop_name, filters.crop))
      .filter((historyItem) => isWithinSelectedRange(historyItem.created_at, filters))
      .map(mapHistoryToCsvRow);

    if (rows.length === 0) {
      throw new Error("No ML price trend data found for the selected crop and date range.");
    }

    const csvContent = buildCsv(rows);
    const filename = createReportFilename("ml-price-trends", filters, format);
    triggerFileDownload(new Blob([csvContent], { type: "text/csv;charset=utf-8;" }), filename);
    return filename;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error("Session expired or unauthorized. Please log in again as admin.");
    }

    if (axios.isAxiosError(error) && error.response?.status === 403) {
      throw new Error("You do not have permission to export this admin report.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to download ML price trends report.");
  }
};

const downloadBackendReport = async (
  reportType: BackendReportType,
  filters: ReportFilters,
  format: ReportFileFormat = "csv"
): Promise<string> => {
  const fallbackFilename = createReportFilename(
    reportType === "transactions" ? "market-transactions" : "combined-market-report",
    filters,
    format
  );

  try {
    const response = await api.get(BACKEND_REPORT_ENDPOINTS[reportType], {
      params: serializeFilters(filters, format),
      responseType: "blob",
    });

    const filename = getFilenameFromDisposition(
      response.headers["content-disposition"] as string | undefined,
      fallbackFilename
    );

    if (format === "csv" && (await isHeaderOnlyCsvBlob(response.data))) {
      throw new Error("No rows found for the selected filters. Try a wider date range or choose All crops.");
    }

    triggerFileDownload(response.data, filename);
    return filename;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error("Session expired or unauthorized. Please log in again as admin.");
    }

    if (axios.isAxiosError(error) && error.response?.status === 404) {
      const endpoint = BACKEND_REPORT_ENDPOINTS[reportType];
      throw new Error(`Backend export endpoint ${endpoint} is not available yet.`);
    }

    if (axios.isAxiosError(error) && error.response?.status === 403) {
      throw new Error("You do not have permission to export this admin report.");
    }

    if (axios.isAxiosError(error) && error.response?.status === 400) {
      const detail = await extractBadRequestDetail(error.response.data);
      throw new Error(detail ? `Unable to export report: ${detail}` : "Invalid report filters. Please review your crop/date selections and try again.");
    }

    throw new Error(`Failed to download ${reportType} report.`);
  }
};

export const downloadMarketTransactionsReport = async (
  filters: ReportFilters,
  format: ReportFileFormat = "csv"
): Promise<string> => downloadBackendReport("transactions", filters, format);

export const downloadCombinedMarketReport = async (
  filters: ReportFilters,
  format: ReportFileFormat = "csv"
): Promise<string> => downloadBackendReport("combined", filters, format);

export const checkBackendReportEndpointHealth = async (
  reportType: BackendReportType,
  format: ReportFileFormat = "csv"
): Promise<ReportEndpointHealth> => {
  try {
    await api.get(BACKEND_REPORT_ENDPOINTS[reportType], {
      params: { format },
      responseType: "blob",
    });
    return "available";
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return "unauthorized";
    }

    if (axios.isAxiosError(error) && error.response?.status === 403) {
      return "unauthorized";
    }

    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return "missing";
    }

    return "unknown";
  }
};