"use client";

import React, { useState, useEffect } from "react";
import { useWallets } from "@privy-io/react-auth";
import { useClankerDeploy } from "@/hooks/useClankerDeployment";
import Navbar from "@/components/NavBar";
import {
  InfoTooltip,
  FieldLabel,
  SectionHeader,
  OptionCard,
} from "@/components/create/FieldBits";
import { TbLoader2 } from "react-icons/tb";

/* ----------------------------- Types ----------------------------- */

type SectionKey =
  | "metadata"
  | "rewardRecipients"
  | "feeConfig"
  | "poolConfig"
  | "creatorBuy"
  | "creatorVault";

type FormErrors = {
  name?: string;
  symbol?: string;
  imageUrl?: string;
};

/* --------------------------- Page --------------------------- */

export default function CreatePage() {
  const { wallets } = useWallets();
  const { deployToken, isDeploying, error: deployError } = useClankerDeploy();

  const isConnected = wallets.length > 0;

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>(
    {
      metadata: true,
      rewardRecipients: false,
      feeConfig: false,
      poolConfig: false,
      creatorBuy: false,
      creatorVault: false,
    }
  );

  const [form, setForm] = useState({
    network: "Base",
    name: "",
    symbol: "",
    description: "",
    imageUrl: "",
    devBuyEth: "",
    vaultPercentage: "",

    // metadata links
    telegram: "",
    website: "",
    twitter: "",
    farcaster: "",

    // reward recipients
    adminAddress: "",
    rewardRecipientAddress: "",
    rewardToken: "WETH" as "WETH" | "CLANKER" | "BOTH",
    rewardPercentage: "100",

    // fee config
    feeMode: "STATIC" as "STATIC" | "DYNAMIC",
    feeTier: "1", // "1" | "2" | "3"
    sniperTaxDuration: "15",

    // pool config
    poolType: "PROJECT_10" as "PROJECT_10" | "LEGACY" | "PROJECT_20",
    startingMcap: "10",

    // creator buy
    creatorBuyEth: "0",

    // creator vault
    vaultRecipientAddress: "",
    lockupDays: "30",
    vestingMode: "INSTANT" as "INSTANT" | "30" | "180",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  /* --------------------------- Validation --------------------------- */

  const validate = (values = form) => {
    const nextErrors: FormErrors = {};
    if (!values.name.trim()) nextErrors.name = "Token name is required";
    if (!values.symbol.trim()) nextErrors.symbol = "Symbol is required";
    if (!values.imageUrl.trim()) nextErrors.imageUrl = "Image URL is required";
    setErrors(nextErrors);
    return nextErrors;
  };

  useEffect(() => {
    validate();
  }, [form]);

  const isFormValid =
    !errors.name && !errors.symbol && !errors.imageUrl && isConnected;

  const inputClass = (field: keyof FormErrors) =>
    `w-full rounded-xl p-4 text-sm outline-none transition
     ${
       errors[field] && touched[field]
         ? "border border-red-400 bg-red-50"
         : "border border-gray-200 focus:border-emerald-500"
     }`;

  /* --------------------------- Helpers --------------------------- */

  const toggleSection = (section: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateForm = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleDeploy = async () => {
    const errs = validate();
    setTouched({ name: true, symbol: true, imageUrl: true });
    if (Object.keys(errs).length > 0 || !isConnected) return;

    await deployToken({
      name: form.name,
      symbol: form.symbol,
      description: form.description,
      imageUrl: form.imageUrl,
      devBuyEth: form.devBuyEth ? parseFloat(form.devBuyEth) : undefined,
      network: form.network,
      vault: form.vaultPercentage
        ? {
            percentage: parseFloat(form.vaultPercentage),
            lockupDuration: 2_592_000,
            vestingDuration: 2_592_000,
          }
        : undefined,
    });
  };

  if (!mounted) return null;

  /* ------------------------- Create View ------------------------- */

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="max-w-xl mx-auto px-6 py-12">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-title font-bold mb-4">Launch Token</h1>
          <p className="text-gray-500 text-sm">
            Deploy instantly to Base or Monad.
          </p>
        </header>

        {/* ---------- Network ---------- */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-text-muted">Network</span>
            <InfoTooltip text="Select the blockchain network where your token will be deployed." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["Base", "Monad"].map((net) => (
              <OptionCard
                key={net}
                selected={form.network === net}
                onClick={() => updateForm("network", net)}
                label={
                  <>
                    <img
                      src={`/images/${net.toLowerCase()}.png`}
                      className="h-5"
                      alt={net}
                    />
                    {net}
                  </>
                }
              />
            ))}
          </div>
        </div>

        {/* ---------- Required Fields ---------- */}
        <div className="space-y-4">
          <div>
            <FieldLabel label="Token Name" required />
            <input
              className={inputClass("name")}
              value={form.name}
              placeholder="Enter token name"
              onChange={(e) => updateForm("name", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            />
          </div>

          <div>
            <FieldLabel label="Symbol" required />
            <input
              className={inputClass("symbol")}
              value={form.symbol}
              placeholder="Enter token symbol"
              onChange={(e) => updateForm("symbol", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, symbol: true }))}
            />
          </div>

          <div>
            <FieldLabel label="Image URL" required />
            <input
              className={inputClass("imageUrl")}
              value={form.imageUrl}
              placeholder="Enter token image url"
              onChange={(e) => updateForm("imageUrl", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, imageUrl: true }))}
            />
          </div>
        </div>

        {/* ---------- Token Metadata (optional) ---------- */}
        <div className="pt-6">
          <SectionHeader
            title="Token Metadata (optional)"
            tooltip="Add additional information about your token"
            isOpen={openSections.metadata}
            onToggle={() => toggleSection("metadata")}
          />

          {openSections.metadata && (
            <div className="mt-4 space-y-4">
              <div>
                <FieldLabel label="Description" />
                <textarea
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm min-h-[100px]"
                  placeholder="Enter token description"
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                />
              </div>

              <div>
                <FieldLabel label="Website Link" />
                <input
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm"
                  placeholder="https://..."
                  value={form.website}
                  onChange={(e) => updateForm("website", e.target.value)}
                />
              </div>

              <div>
                <FieldLabel label="X (Twitter) Link" />
                <input
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm"
                  placeholder="https://x.com/..."
                  value={form.twitter}
                  onChange={(e) => updateForm("twitter", e.target.value)}
                />
              </div>

              <div>
                <FieldLabel label="Farcaster Link" />
                <input
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm"
                  placeholder="https://farcaster.xyz/..."
                  value={form.farcaster}
                  onChange={(e) => updateForm("farcaster", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* ---------- Reward Recipients (optional) ---------- */}
        <div className="pt-6">
          <SectionHeader
            title="Reward Recipients (optional)"
            tooltip="Configure reward admins and recipients."
            isOpen={openSections.rewardRecipients}
            onToggle={() => toggleSection("rewardRecipients")}
          />

          {openSections.rewardRecipients && (
            <div className="pt-4 space-y-4">
              <div>
                <FieldLabel label="Admin Address" />
                <input
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm font-mono"
                  placeholder="0x..."
                  value={form.adminAddress}
                  onChange={(e) => updateForm("adminAddress", e.target.value)}
                />
              </div>

              <div>
                <FieldLabel label="Reward Recipient Address" />
                <input
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm font-mono"
                  placeholder="0x..."
                  value={form.rewardRecipientAddress}
                  onChange={(e) =>
                    updateForm("rewardRecipientAddress", e.target.value)
                  }
                />
              </div>

              <div>
                <FieldLabel label="Reward Token" />
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: "WETH", label: "WETH" },
                    { key: "CLANKER", label: "$Your Clanker" },
                    { key: "BOTH", label: "Both" },
                  ].map((opt) => (
                    <OptionCard
                      key={opt.key}
                      label={opt.label}
                      selected={form.rewardToken === opt.key}
                      onClick={() => updateForm("rewardToken", opt.key)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel label="Reward Percentage" />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-xl p-4 text-sm"
                    value={form.rewardPercentage}
                    onChange={(e) =>
                      updateForm("rewardPercentage", e.target.value)
                    }
                  />
                  <span className="text-sm text-gray-500 pr-2">%</span>
                </div>
              </div>

              <p className="text-xs text-emerald-600 font-medium">
                Allocated Rewards: {form.rewardPercentage || "0"}/100%
              </p>
            </div>
          )}
        </div>

        {/* ---------- Fee Configuration (optional) ---------- */}
        <div className="pt-6">
          <SectionHeader
            title="Fee Configuration (optional)"
            tooltip="Configure fee mode, tier and sniper tax."
            isOpen={openSections.feeConfig}
            onToggle={() => toggleSection("feeConfig")}
          />

          {openSections.feeConfig && (
            <div className="pt-4 space-y-4">
              <div>
                <FieldLabel label="Mode" />
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "STATIC", label: "Static" },
                    { key: "DYNAMIC", label: "Dynamic 3%" },
                  ].map((opt) => (
                    <OptionCard
                      key={opt.key}
                      label={opt.label}
                      selected={form.feeMode === opt.key}
                      onClick={() => updateForm("feeMode", opt.key)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel label="Fee Tier" />
                <div className="grid grid-cols-3 gap-3">
                  {["1", "2", "3"].map((tier) => (
                    <OptionCard
                      key={tier}
                      label={`${tier}%`}
                      selected={form.feeTier === tier}
                      onClick={() => updateForm("feeTier", tier)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel label="Sniper Tax Duration" />
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm"
                  value={form.sniperTaxDuration}
                  onChange={(e) =>
                    updateForm("sniperTaxDuration", e.target.value)
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Seconds for sniper tax to decay from starting fee (80%) to
                  ending fee (5%).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ---------- Pool Configuration (optional) ---------- */}
        <div className="pt-6">
          <SectionHeader
            title="Pool Configuration (optional)"
            tooltip="Choose pool template and starting market cap."
            isOpen={openSections.poolConfig}
            onToggle={() => toggleSection("poolConfig")}
          />

          {openSections.poolConfig && (
            <div className="pt-4 space-y-4">
              <div>
                <FieldLabel label="Pool Type" />
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: "PROJECT_10", label: "Project 10 ETH" },
                    { key: "LEGACY", label: "Legacy" },
                    { key: "PROJECT_20", label: "Project 20 ETH" },
                  ].map((opt) => (
                    <OptionCard
                      key={opt.key}
                      label={opt.label}
                      selected={form.poolType === opt.key}
                      onClick={() => updateForm("poolType", opt.key)}
                      className="text-xs sm:text-sm"
                    />
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel label="Starting Market Cap in ETH" />
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm"
                  value={form.startingMcap}
                  onChange={(e) => updateForm("startingMcap", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* ---------- Extension: Creator Buy (optional) ---------- */}
        <div className="pt-6">
          <SectionHeader
            title="Extension: Creator Buy (optional)"
            tooltip="Configure an upfront creator buy."
            isOpen={openSections.creatorBuy}
            onToggle={() => toggleSection("creatorBuy")}
          />

          {openSections.creatorBuy && (
            <div className="pt-4 space-y-3">
              <div>
                <FieldLabel label="ETH Amount for Creator Buy" />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-xl p-4 text-sm"
                    value={form.creatorBuyEth}
                    onChange={(e) =>
                      updateForm("creatorBuyEth", e.target.value)
                    }
                  />
                  <span className="text-sm text-gray-500 pr-2">ETH</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {["0.1", "0.5", "1"].map((amt) => (
                  <OptionCard
                    key={amt}
                    label={`${amt} ETH`}
                    selected={form.creatorBuyEth === amt}
                    onClick={() => updateForm("creatorBuyEth", amt)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ---------- Extension: Creator Vault (optional) ---------- */}
        <div className="pt-6">
          <SectionHeader
            title="Extension: Creator Vault (optional)"
            tooltip="Lock a portion of supply into a vesting vault."
            isOpen={openSections.creatorVault}
            onToggle={() => toggleSection("creatorVault")}
          />

          {openSections.creatorVault && (
            <div className="pt-4 space-y-4">
              <div>
                <FieldLabel label="Vault Percentage" />
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-xl p-4 text-sm"
                    value={form.vaultPercentage}
                    onChange={(e) =>
                      updateForm("vaultPercentage", e.target.value)
                    }
                  />
                  <span className="text-sm text-gray-500 pr-2">%</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {["5", "15", "30"].map((p) => (
                  <OptionCard
                    key={p}
                    label={`${p}%`}
                    selected={form.vaultPercentage === p}
                    onClick={() => updateForm("vaultPercentage", p)}
                  />
                ))}
              </div>

              <div>
                <FieldLabel label="Vault Recipient Address" />
                <input
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm font-mono"
                  placeholder="0x..."
                  value={form.vaultRecipientAddress}
                  onChange={(e) =>
                    updateForm("vaultRecipientAddress", e.target.value)
                  }
                />
              </div>

              <div>
                <FieldLabel label="Lockup Period" />
                <div className="grid grid-cols-4 gap-3">
                  {["7", "30", "90", "180"].map((d) => (
                    <OptionCard
                      key={d}
                      label={`${d}d`}
                      selected={form.lockupDays === d}
                      onClick={() => updateForm("lockupDays", d)}
                      className="text-xs sm:text-sm"
                    />
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel label="Vesting Period" />
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: "INSTANT", label: "Instant" },
                    { key: "30", label: "30 days" },
                    { key: "180", label: "180 days" },
                  ].map((opt) => (
                    <OptionCard
                      key={opt.key}
                      label={opt.label}
                      selected={form.vestingMode === opt.key}
                      onClick={() => updateForm("vestingMode", opt.key)}
                      className="text-xs sm:text-sm"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ---------- Terms & Conditions ---------- */}
        <div className="pt-8">
          <label className="flex items-start justify-center gap-3 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>
              I confirm that I have read and agree to the{" "}
              <span className="font-medium text-gray-900">
                Terms & Conditions
              </span>
            </span>
          </label>
        </div>

        {/* ---------- Deploy ---------- */}
        <div className="pt-8">
          <button
            onClick={handleDeploy}
            disabled={!isFormValid || isDeploying || !acceptedTerms}
            className={`w-full py-3 rounded-full font-bold transition
              ${
                !isFormValid || isDeploying || !acceptedTerms
                  ? "bg-gray-200 text-gray-400"
                  : "bg-primary text-white hover:bg-green-600"
              }`}
          >
            {isDeploying ? (
              <div className="flex items-center justify-center gap-2">
                <TbLoader2 className="animate-spin" size={20} /> Deploying...
              </div>
            ) : (
              `Create token on ${form.network}`
            )}
          </button>

          {deployError && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-center">
              {deployError}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
