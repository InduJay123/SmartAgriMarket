import { X } from "lucide-react";
import Chat from "../Chat";
import { useTranslation } from "react-i18next";

interface ChatModalProps {
  farmerUserId: number;
  onClose: () => void;
}

const ChatModal = ({ farmerUserId, onClose }: ChatModalProps) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md h-[500px] rounded-xl shadow-xl relative p-4">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600"
        >
          <X />
        </button>

        <h3 className="font-semibold text-lg mb-2">{t("Chat with Buyer")}</h3>

        <Chat otherUserId={farmerUserId} />
      </div>
    </div>
  );
};

export default ChatModal;