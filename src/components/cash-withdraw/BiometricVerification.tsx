"use client";

import { useEffect, useState, useRef } from "react";
import { Button, Input, message } from "antd";
import Image from "next/image";
import { CardLayout } from "@/lib/layouts/CardLayout";
import { useAepsTwoFactorAuthentication } from "@/features/retailer/cash_withdrawl/data/hooks";
import { biometricString } from "@/config/app.config";
import { useServiceSubscribe } from "@/features/retailer/services";
import SmartModal from "../ui/SmartModal";

type BiometricVerificationProps = {
  onStart?: () => void; // called ONLY when 2FA succeeds
  userName?: string;
  service_id: string;
  user_id: string;
};

export default function BiometricVerification({
  onStart,
  userName = "Rajesh Kumar",
  service_id,
  user_id,
}: BiometricVerificationProps) {
  const [aadhaar, setAadhaar] = useState("");
  const [touched, setTouched] = useState(false);
  const [latlng, setLatlng] = useState<string>("");
  const [geoError, setGeoError] = useState<string | null>(null);

  // subscribe modal state
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const subscribeBtnRef = useRef<HTMLButtonElement | null>(null);

  const isValidAadhaar = /^\d{12}$/.test(aadhaar);
  const showError = touched && !isValidAadhaar;

  const { aepsTwoFactorAuthenticateAsync, isLoading: isVerifying } =
    useAepsTwoFactorAuthentication();

  const {
    subscribeAsync,
    isLoading: isSubscribing,
  } = useServiceSubscribe();

  // Ask for location on mount; format as "lat~lng"
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLatlng(`${latitude.toFixed(6)}~${longitude.toFixed(6)}`);
        setGeoError(null);
      },
      () => {
        setGeoError("We couldn't access your location. Please allow permission and retry.");
        setLatlng(""); // keep empty so button stays disabled
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 12);
    setAadhaar(digitsOnly);
  };

  const is403 = (x: any) =>
    x?.status === 403 ||
    x?.statusCode === 403 ||
    x?.response?.status === 403 ||
    x?.data?.status === 403;

  const call2FA = async () => {
    // Never log Aadhaar/biometric to console
    const res = await aepsTwoFactorAuthenticateAsync({
      user_id,
      service_id,
      aadhaar_number: aadhaar,
      latlng,
      biometric_data: biometricString,
    });
    return res;
  };

  const handleVerify = async () => {
    setTouched(true);
    if (!isValidAadhaar || !latlng) return;
    try {
      const res = await call2FA();

      // If your API returns non-throwing 402
      if (is403(res)) {
        setSubscribeOpen(true);
        return;
      }

      // Treat anything else here as success
      onStart?.();
    } catch (err: any) {
      // 402 means subscription needed → open modal
      if (is403(err)) {
        setSubscribeOpen(true);
        return;
      }
      message.error(err?.message || "Verification failed. Please try again.");
    }
  };

  const handleSubscribe = async () => {
    try {
      await subscribeAsync({ service_id, status: "ACTIVE" });
      message.success("Subscribed successfully. Retrying verification…");
      setSubscribeOpen(false);

      // auto retry 2FA once after subscribing
      try {
        const res = await call2FA();
        if (is403(res)) {
          // still blocked; show modal again
          setSubscribeOpen(true);
          return;
        }
        onStart?.();
      } catch (err: any) {
        if (is403(err)) {
          setSubscribeOpen(true);
        } else {
          message.error(err?.message || "Verification failed after subscribing.");
        }
      }
    } catch (e: any) {
      message.error(e?.message || "Subscription failed. Please try again.");
    }
  };

  return (
    <>
      <CardLayout
        variant="info"
        size="lg"
        width="w-full max-w-md"
        height="min-h-[440px]"
        divider
        className="mx-auto bg-white shadow-xl"
        header={
          <div className="text-center">
            <h2 className="text-xl text-black font-medium">
              Agent Biometric Verification Required
            </h2>
            <span className="text-xs text-[#9A9595]">
              Verification session timed out. Please start again.
            </span>
            <div className="!text-center h-6 flex items-center !mx-auto shadow mt-1 w-fit bg-white rounded-xl">
              <Image
                src="/remaining.svg"
                alt="time remaining"
                width={122}
                height={24}
                className="object-contain"
              />
            </div>
          </div>
        }
        body={
          <div className="grid place-items-center gap-3 py-6 !mb-0">
            <div className="h-24 w-24 rounded-full bg-white shadow-inner grid place-items-center">
              <Image
                src="/biometric.svg"
                alt="Biometric Verification"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>

            <div className="flex items-center gap-2 bg-[#E6F0FF] text-[#3386FF] font-medium text-sm rounded-full px-4 py-2 w-[164px] h-[24px]">
              <Image src="/person.svg" alt="person logo" height={16} width={16} />
              <span className="text-[10px]">Ready for Verification</span>
            </div>

            <div className="text-[12px] text-[#9A9595]">
              Verifying: <strong className="text-[#232323]">{userName}</strong>
            </div>

            {/* Aadhaar number input */}
            <div className="w-full px-5 flex flex-col">
              <label htmlFor="aadhaar" className="text-xs text-[#6b6b6b] mb-1">
                Aadhaar Number
              </label>
              <Input
                id="aadhaar"
                name="aadhaar"
                type="tel"
                placeholder="Enter 12-digit Aadhaar number"
                value={aadhaar}
                onChange={handleChange}
                onBlur={() => setTouched(true)}
                maxLength={12}
                inputMode="numeric"
                pattern="[0-9]*"
                aria-invalid={showError}
                aria-describedby="aadhaar-help"
                status={showError ? "error" : undefined}
                autoComplete="off"
                allowClear
              />
              <div
                id="aadhaar-help"
                className={`mt-1 text-[11px] ${
                  showError ? "text-red-500" : "text-[#9A9595]"
                }`}
              >
                {showError
                  ? "Please enter a valid 12-digit Aadhaar number."
                  : "Enter digits only."}
              </div>
            </div>

            {geoError && (
              <div className="text-[11px] text-amber-600 px-5">
                {geoError}
              </div>
            )}

            <Button
              className="!bg-[#3386FF] !text-white !w-[355px] !h-[38px] !rounded-[12px]"
              onClick={handleVerify}
              disabled={!isValidAadhaar || !latlng || isVerifying}
            >
              {isVerifying ? "Verifying..." : "Start Verification"}
            </Button>
          </div>
        }
        footer={
          <ul className="text-center text-[#9A9595] text-[12px] font-medium">
            <li>• Ensure your finger is clean and dry</li>
            <li>• Place finger firmly on the scanner</li>
            <li>• Hold still during scanning process</li>
          </ul>
        }
      />

      {/* ===== Subscribe Modal (opens on 402) ===== */}
      <SmartModal
        open={subscribeOpen}
        onClose={() => (!isSubscribing ? setSubscribeOpen(false) : null)}
        ariaLabel="SubscribeRequiredTitle"
        centered
        animation="scale"
        initialFocusRef={subscribeBtnRef}
        contentClassName="max-w-md"
      >
        <SmartModal.Header className="bg-white">
          <h3 id="SubscribeRequiredTitle" className="text-lg font-semibold text-[#111]">
            Subscription Required
          </h3>
        </SmartModal.Header>

        <SmartModal.Body>
          <p className="text-sm text-[#444]">
            You need an active subscription to use AEPS cash withdrawal. Click{" "}
            <strong>Subscribe</strong> to activate this service for your account.
          </p>
        </SmartModal.Body>

        <SmartModal.Footer>
          <Button onClick={() => setSubscribeOpen(false)} disabled={isSubscribing}>
            Cancel
          </Button>
          <Button
            type="primary"
            className="!bg-[#3386FF]"
            ref={subscribeBtnRef as any}
            loading={isSubscribing}
            onClick={handleSubscribe}
          >
            {isSubscribing ? "Subscribing…" : "Subscribe"}
          </Button>
        </SmartModal.Footer>
      </SmartModal>
    </>
  );
}
