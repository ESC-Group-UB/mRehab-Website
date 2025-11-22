import React, { FC, useState } from "react";
import styles from "./DeviceSelectionModal.module.css";

const deviceOptions: Record<string, string[]> = {
  iPhone: [
    "iPhone 16 Pro Max",
    "iPhone 16 Pro",
    "iPhone 16 Plus",
    "iPhone 16",
    "iPhone 16e",
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15 Plus",
    "iPhone 15",
    "iPhone 14 Pro Max",
    "iPhone 14 Pro",
    "iPhone 14 Plus",
    "iPhone 14",
    "iPhone 13 Pro Max",
    "iPhone 13 Pro",
    "iPhone 13",
    "iPhone 13 mini",
    "iPhone 12 Pro Max",
    "iPhone 12 Pro",
    "iPhone 12",
    "iPhone 12 mini",
    "iPhone SE (3rd generation, 2022)",
  ],
  Samsung: [
    "Galaxy S25 Ultra",
    "Galaxy S25+",
    "Galaxy S25",
    "Galaxy S24 Ultra",
    "Galaxy S24+",
    "Galaxy S24",
    "Galaxy S24 FE",
    "Galaxy S23 Ultra",
    "Galaxy S23+",
    "Galaxy S23",
    "Galaxy S23 FE",
    "Galaxy S22 Ultra",
    "Galaxy S22+",
    "Galaxy S22",
    "Galaxy S21 Ultra",
    "Galaxy S21+",
    "Galaxy S21",
    "Galaxy S21 FE",
    "Galaxy Z Fold7",
    "Galaxy Z Flip7",
    "Galaxy Z Flip7 FE",
    "Galaxy Z Fold6",
    "Galaxy Z Flip6",
    "Galaxy Z Fold5",
    "Galaxy Z Flip5",
    "Galaxy Z Fold4",
    "Galaxy Z Flip4",
    "Galaxy Z Fold3",
    "Galaxy Z Flip3",
  ],
  Google: [
    "Pixel 10 Pro Fold",
    "Pixel 10 Pro XL",
    "Pixel 10 Pro",
    "Pixel 10",
    "Pixel 9 Pro Fold",
    "Pixel 9 Pro XL",
    "Pixel 9 Pro",
    "Pixel 9",
    "Pixel 9a",
    "Pixel 8a",
    "Pixel 8 Pro",
    "Pixel 8",
    "Pixel Fold",
    "Pixel 7a",
    "Pixel 7 Pro",
    "Pixel 7",
    "Pixel 6a",
    "Pixel 6 Pro",
    "Pixel 6",
    "Pixel 5a (5G)",
  ],
};

export type DeviceSelectionResult = {
  brand: string;
  deviceModel: string;
  caseLink: string;
};

interface DeviceSelectionModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: (result: DeviceSelectionResult) => void;
}

const DeviceSelectionModal: FC<DeviceSelectionModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => {
  const [brand, setBrand] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [caseLink, setCaseLink] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!brand || !deviceModel) {
      setLocalError("Please select your device.");
      return;
    }

    setLocalError(null);
    onConfirm({ brand, deviceModel, caseLink });
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Confirm your device</h3>

        <select
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
            setDeviceModel("");
          }}
          className={styles.input}
        >
          <option value="">Select brand…</option>
          {Object.keys(deviceOptions).map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        {brand && (
          <select
            value={deviceModel}
            onChange={(e) => setDeviceModel(e.target.value)}
            className={styles.input}
          >
            <option value="">Select model…</option>
            {deviceOptions[brand].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        )}

        <div className={styles.caseInputGroup}>
          <label htmlFor="caseLink" className={styles.caseLabel}>
            Case Link (optional)
          </label>

          <input
            id="caseLink"
            type="url"
            className={styles.caseInput}
            placeholder="Paste a link to the case you use (Amazon, OtterBox, etc.)"
            value={caseLink}
            onChange={(e) => setCaseLink(e.target.value)}
            inputMode="url"
          />

          <p className={styles.caseHelpText}>
            If you use a protective case, this helps us ensure the perfect fit.
          </p>
        </div>

        {localError && <p className={styles.errorMsg}>{localError}</p>}

        <div className={styles.modalActions}>
          <button onClick={onCancel} className={styles.cancelBtn}>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={styles.confirmBtn}
            disabled={!brand || !deviceModel}
          >
            Confirm &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceSelectionModal;
