import emoji from "emoji-dictionary";
import { Info } from "lucide-react";
import type { CropFormData } from "../../@types/CropFormData";
import { useTranslation } from "react-i18next";

interface PricingProps {
  formData: CropFormData;
  setFormData: React.Dispatch<React.SetStateAction<CropFormData>>;
  averagePrice: number | null;
  premiumPrice: number | null;
  loading?: boolean;
  error?: string | null;
}

const Pricing: React.FC<PricingProps> = ({
  formData,
  setFormData,
  averagePrice,
  premiumPrice,
  loading = false,
  error = null,
}) => {
      const { t, i18n } = useTranslation();
      const isSinhala = i18n.language === "si";


  return (
    <div className={`p-4 ${isSinhala ? "font-sinhala" : "font-sans"}`}>
      <h2 className="text-5xl">{emoji.getUnicode("moneybag")}</h2>
      <h3 className="text-2xl font-bold mt-2 mb-2">{t("Set your price")}</h3>
      <p className="text-sm text-gray-500 mb-4">{t("What's your expected price?")}</p>



      <p className="flex flex-wrap gap-2 bg-gray-50 border rounded-xl p-4 text-gray-600 text-sm mt-2 mb-6">
        <Info size={18} className="text-green-800" />
        <span className="font-semibold text-black">{t("Pricing Tip:")}</span>
        {t("Check current market prices in your region. Competitive pricing attracts more buyers!")}
      </p>

      <div className="flex flex-col items-start justify-start">

        <label htmlFor="pricePerKg" className="font-semibold mb-2 text-green-800">
          {emoji.getUnicode("dollar")} {t("Price per kg")}

        </label>

        <input
          id="pricePerKg"
          type="number"
          placeholder="RS. 250"
          value={formData.pricePerKg ?? ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              pricePerKg: e.target.value === "" ? undefined : Number(e.target.value),
            })
          }
          className="w-full bg-gray-50 border rounded-xl p-2 text-gray-900"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6 mb-4">
        <div className="border rounded-xl p-3 hover:border-green-700">
          <p className="text-gray-600 text-sm">{t("Market Average")}</p>

          <p className="text-lg font-semibold text-green-800">
            {loading ? "Loading..." : averagePrice !== null ? `Rs. ${averagePrice}` : "Rs. --"}
          </p>
        </div>

        <div className="border rounded-xl p-3 hover:border-green-700">
          <p className="text-gray-600 text-sm">{t("Your Price")}</p>
          <p className="text-lg font-semibold text-green-800">
            {formData.pricePerKg ? `Rs. ${formData.pricePerKg}` : "Rs. --"}
          </p>
        </div>

        <div className="border rounded-xl p-3 hover:border-green-700">
          <p className="text-gray-600 text-sm">Premium Price</p>

          <p className="text-lg font-semibold text-green-800">
            {loading ? "Loading..." : premiumPrice !== null ? `Rs. ${premiumPrice}` : "Rs. --"}
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-2">
          {error}
        </p>
      )}
    </div>
  );
};

export default Pricing;