import { useEffect, useState } from "react";
import { User, Lock, Bell, Globe, X } from "lucide-react";
import api from "../../services/api";

type Language = "English" | "Sinhala" | "Tamil";




interface AdminSettingsDTO {
   username: string;
   email: string;
 
  email_notifications: boolean;
  price_alert_notifications: boolean;
  system_update_notifications: boolean;
}

const emptySettings: AdminSettingsDTO = {
  //full_name: "",
  username: "",
  email: "",
 // phone: "",
 // language: "English",
 // timezone: "Asia/Colombo",
  email_notifications: true,
  price_alert_notifications: true,
  system_update_notifications: false,
};

export default function Settings() {
  const [settings, setSettings] = useState<AdminSettingsDTO>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // feedback
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // change password modal
  const [pwOpen, setPwOpen] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwForm, setPwForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const fetchSettings = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // ✅ Backend: GET /api/admin/settings/
      const res = await api.get("/auth/admin/settings/");
      setSettings({
        ...emptySettings,
        ...res.data,
      });
    } catch (err: any) {
      console.error("Failed to load admin settings:", err);
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Failed to load settings. Check token / permissions.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      // ✅ Backend: PUT /api/admin/settings/
      const payload = {
        username : settings.username,
        email: settings.email,
        // phone: settings.phone,
        // language: settings.language,
        // timezone: settings.timezone,
        email_notifications: settings.email_notifications,
        price_alert_notifications: settings.price_alert_notifications,
        system_update_notifications: settings.system_update_notifications,
      };

      const res = await api.put("/auth/admin/settings/", payload);
      setSettings({ ...emptySettings, ...res.data });
      setSuccessMsg("Saved successfully ✅");
      setTimeout(() => setSuccessMsg(""), 2500);
    } catch (err: any) {
      console.error("Save settings failed:", err);
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Save failed. Check backend validation.";
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    setPwError("");
    setPwSuccess("");

    if (!pwForm.old_password || !pwForm.new_password) {
      setPwError("Please enter old and new password.");
      return;
    }
    if (pwForm.new_password !== pwForm.confirm_password) {
      setPwError("New password and confirm password do not match.");
      return;
    }

    setPwLoading(true);
    try {
      // ✅ Backend: POST /api/admin/change-password/
      await api.post("/auth/admin/change-password/", {
        old_password: pwForm.old_password,
        new_password: pwForm.new_password,
      });

      setPwSuccess("Password updated ✅");
      setPwForm({ old_password: "", new_password: "", confirm_password: "" });

      setTimeout(() => {
        setPwOpen(false);
        setPwSuccess("");
      }, 900);
    } catch (err: any) {
      console.error("Change password failed:", err);
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Password change failed.";
      setPwError(msg);
    } finally {
      setPwLoading(false);
    }
  };

  const inputBase =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <div className="space-y-6 pr-28">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold">Settings / Profile</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your admin profile, preferences, and security.
            </p>
          </div>

          <button
            onClick={fetchSettings}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {/* Feedback */}
        {errorMsg && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 rounded-lg border border-green-300 bg-green-50 text-green-700 px-4 py-3 text-sm">
            {successMsg}
          </div>
        )}

        {loading ? (
          <div className="py-10 text-center text-gray-500">Loading settings...</div>
        ) : (
          <div className="space-y-6">
            {/* Profile */}
            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <User className="text-emerald-600" size={24} />
                <h3 className="font-semibold text-lg">Profile Information</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={settings.username}
                    onChange={(e) => setSettings((p) => ({ ...p, username: e.target.value }))}
                    className={inputBase}
                    placeholder="Your username"
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => setSettings((p) => ({ ...p, phone: e.target.value }))}
                    className={inputBase}
                    placeholder="+94 7X XXX XXXX"
                  />
                </div> */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings((p) => ({ ...p, email: e.target.value }))}
                    className={inputBase}
                    placeholder="admin@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="text-emerald-600" size={24} />
                <h3 className="font-semibold text-lg">Security</h3>
              </div>

              <button
                onClick={() => {
                  setPwError("");
                  setPwSuccess("");
                  setPwOpen(true);
                }}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Change Password
              </button>
            </div>

            {/* Notifications */}
            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="text-emerald-600" size={24} />
                <h3 className="font-semibold text-lg">Notifications</h3>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.email_notifications}
                    onChange={(e) =>
                      setSettings((p) => ({ ...p, email_notifications: e.target.checked }))
                    }
                    className="w-4 h-4 text-emerald-600"
                  />
                  <span>Email notifications</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.price_alert_notifications}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        price_alert_notifications: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-emerald-600"
                  />
                  <span>Price alert notifications</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.system_update_notifications}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        system_update_notifications: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-emerald-600"
                  />
                  <span>System update notifications</span>
                </label>
              </div>
            </div>

            {/* Preferences */}
            

            {/* Save */}
            <button
              onClick={saveSettings}
              disabled={saving}
              className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {pwOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
          onClick={() => setPwOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">Change Password</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Enter your old password and set a new one.
                </p>
              </div>

              <button
                onClick={() => setPwOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Close"
              >
                <X />
              </button>
            </div>

            {pwError && (
              <div className="mt-4 rounded-lg border border-red-300 bg-red-50 text-red-700 px-4 py-3 text-sm">
                {pwError}
              </div>
            )}
            {pwSuccess && (
              <div className="mt-4 rounded-lg border border-green-300 bg-green-50 text-green-700 px-4 py-3 text-sm">
                {pwSuccess}
              </div>
            )}

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Old Password
                </label>
                <input
                  type="password"
                  value={pwForm.old_password}
                  onChange={(e) => setPwForm((p) => ({ ...p, old_password: e.target.value }))}
                  className={inputBase}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={pwForm.new_password}
                  onChange={(e) => setPwForm((p) => ({ ...p, new_password: e.target.value }))}
                  className={inputBase}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: use a strong password (min 8 chars, mix letters/numbers/symbols).
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={pwForm.confirm_password}
                  onChange={(e) => setPwForm((p) => ({ ...p, confirm_password: e.target.value }))}
                  className={inputBase}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setPwOpen(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={pwLoading}
              >
                Cancel
              </button>

              <button
                onClick={changePassword}
                disabled={pwLoading}
                className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60"
              >
                {pwLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
