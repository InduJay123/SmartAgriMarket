import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Brain, Download, Loader2, ShoppingCart, TrendingUp } from "lucide-react";
import { AVAILABLE_CROPS } from "../../lib/MLService";
import {
  checkBackendReportEndpointHealth,
  downloadCombinedMarketReport,
  downloadMarketTransactionsReport,
  downloadMlPriceTrendReport,
  type ReportEndpointHealth,
  type ReportFileFormat,
  type ReportFilters,
} from "../../api/reports";

type ReportKey = "mlPriceTrends" | "marketTransactions" | "combinedMarket";

type NoticeState = {
  type: "success" | "error";
  text: string;
} | null;

export default function Reports() {
  const [filters, setFilters] = useState<ReportFilters>({
    crop: "all",
    startDate: "",
    endDate: "",
  });
  const [notice, setNotice] = useState<NoticeState>(null);
  const [downloadFormat, setDownloadFormat] = useState<ReportFileFormat>("csv");
  const [loadingState, setLoadingState] = useState<Record<ReportKey, boolean>>({
    mlPriceTrends: false,
    marketTransactions: false,
    combinedMarket: false,
  });
  const [endpointHealth, setEndpointHealth] = useState<Record<"marketTransactions" | "combinedMarket", ReportEndpointHealth>>({
    marketTransactions: "unknown",
    combinedMarket: "unknown",
  });
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [lastFailedReport, setLastFailedReport] = useState<ReportKey | null>(null);

  const dateError = useMemo(() => {
    if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
      return "Start date must be earlier than or equal to the end date.";
    }

    return "";
  }, [filters.endDate, filters.startDate]);

  const selectedCropLabel = filters.crop === "all" ? "All crops" : filters.crop;

  const updateFilter = (key: keyof ReportFilters, value: string) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  const refreshEndpointHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const [transactionsHealth, combinedHealth] = await Promise.all([
        checkBackendReportEndpointHealth("transactions", downloadFormat),
        checkBackendReportEndpointHealth("combined", downloadFormat),
      ]);

      setEndpointHealth({
        marketTransactions: transactionsHealth,
        combinedMarket: combinedHealth,
      });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  useEffect(() => {
    refreshEndpointHealth();
  }, [downloadFormat]);

  const runDownload = async (reportKey: ReportKey) => {
    if (dateError) {
      setNotice({ type: "error", text: dateError });
      return;
    }

    setNotice(null);
    setLoadingState((currentState) => ({
      ...currentState,
      [reportKey]: true,
    }));

    try {
      let filename = "";

      if (reportKey === "mlPriceTrends") {
        filename = await downloadMlPriceTrendReport(filters, downloadFormat);
      }

      if (reportKey === "marketTransactions") {
        filename = await downloadMarketTransactionsReport(filters, downloadFormat);
      }

      if (reportKey === "combinedMarket") {
        filename = await downloadCombinedMarketReport(filters, downloadFormat);
      }

      setNotice({
        type: "success",
        text: `${filename} downloaded successfully as ${downloadFormat.toUpperCase()}.`,
      });
      setLastFailedReport(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Download failed.";
      setNotice({ type: "error", text: errorMessage });
      setLastFailedReport(reportKey);
    } finally {
      setLoadingState((currentState) => ({
        ...currentState,
        [reportKey]: false,
      }));
    }
  };

  const getHealthBadge = (reportKey: ReportKey) => {
    if (reportKey === "mlPriceTrends") {
      return { label: "Ready now", className: "bg-emerald-100 text-emerald-700" };
    }

    const health = endpointHealth[reportKey];

    if (health === "available") {
      return { label: "Endpoint live", className: "bg-emerald-100 text-emerald-700" };
    }

    if (health === "unauthorized") {
      return { label: "Auth required", className: "bg-amber-100 text-amber-700" };
    }

    if (health === "missing") {
      return { label: "Endpoint missing", className: "bg-red-100 text-red-700" };
    }

    return { label: "Status unknown", className: "bg-gray-100 text-gray-600" };
  };

  const reportCards: Array<{
    key: ReportKey;
    title: string;
    description: string;
    hint: string;
    icon: typeof TrendingUp;
    iconClassName: string;
    requiresBackend: boolean;
  }> = [
    {
      key: "mlPriceTrends",
      title: "ML Price Trends",
      description: "Download predicted crop price history as CSV.",
      hint: "Works now from the ML prediction history already exposed in the app.",
      icon: TrendingUp,
      iconClassName: "text-emerald-600",
      requiresBackend: false,
    },
    {
      key: "marketTransactions",
      title: "Market Transactions",
      description: "Download admin transaction summaries for the selected filters.",
      hint: "Requires GET /auth/admin/reports/transactions/ returning CSV/PDF.",
      icon: ShoppingCart,
      iconClassName: "text-amber-500",
      requiresBackend: true,
    },
    {
      key: "combinedMarket",
      title: "Combined Market Report",
      description: "Download one CSV that joins ML trend output with transaction totals.",
      hint: "Requires GET /auth/admin/reports/combined-market/ returning CSV/PDF.",
      icon: Brain,
      iconClassName: "text-blue-600",
      requiresBackend: true,
    },
  ];

  return (
    <div className="space-y-6 pr-28">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col gap-2 mb-6">
          <h2 className="text-xl lg:text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-sm text-gray-600">
            CSV and PDF exports are supported by format selection. Crop and date filters are optional, and blank dates export data for all time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <label className="flex flex-col gap-2 text-sm text-gray-700">
            Crop
            <select
              value={filters.crop}
              onChange={(event) => updateFilter("crop", event.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All crops</option>
              {AVAILABLE_CROPS.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-gray-700">
            Start date
            <input
              type="date"
              value={filters.startDate}
              onChange={(event) => updateFilter("startDate", event.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-gray-700">
            End date
            <input
              type="date"
              value={filters.endDate}
              onChange={(event) => updateFilter("endDate", event.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-gray-700">
            Format
            <select
              value={downloadFormat}
              onChange={(event) => setDownloadFormat(event.target.value as ReportFileFormat)}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
            </select>
          </label>
        </div>

        <div className="mb-6 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Current filters: {selectedCropLabel} from {filters.startDate || "all time"} to {filters.endDate || "all time"}.
        </div>

        {notice ? (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              notice.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{notice.text}</span>
            </div>
          </div>
        ) : null}

        {dateError ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {dateError}
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {reportCards.map((reportCard) => {
            const Icon = reportCard.icon;
            const isDownloading = loadingState[reportCard.key];
            const isMlPdfUnavailable = reportCard.key === "mlPriceTrends" && downloadFormat === "pdf";

            return (
              <div
                key={reportCard.key}
                className="flex h-full flex-col justify-between rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <Icon className={reportCard.iconClassName} size={32} />
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${getHealthBadge(reportCard.key).className}`}>
                      {getHealthBadge(reportCard.key).label}
                    </span>
                  </div>

                  <h3 className="mb-2 text-lg font-semibold">{reportCard.title}</h3>
                  <p className="mb-3 text-sm text-gray-600">{reportCard.description}</p>
                  <p className="mb-5 text-xs text-gray-500">{reportCard.hint}</p>
                </div>

                <button
                  type="button"
                  onClick={() => runDownload(reportCard.key)}
                  disabled={isDownloading || Boolean(dateError) || isMlPdfUnavailable}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  {isMlPdfUnavailable
                    ? "CSV only"
                    : isDownloading
                      ? `Preparing ${downloadFormat.toUpperCase()}...`
                      : `Download ${downloadFormat.toUpperCase()}`}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={refreshEndpointHealth}
            disabled={isCheckingHealth}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCheckingHealth ? "Checking endpoints..." : "Refresh endpoint status"}
          </button>

          {notice?.type === "error" && lastFailedReport ? (
            <button
              type="button"
              onClick={() => runDownload(lastFailedReport)}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
            >
              Retry failed download
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
