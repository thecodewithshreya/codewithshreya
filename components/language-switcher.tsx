"use client";

import { languages } from "@/lib/i18n";
import { useI18n } from "@/components/i18n-provider";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <label className="inline-flex items-center gap-2 text-xs text-gray-400">
      <span className="sr-only">{t("language.label")}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as typeof language)}
        aria-label={t("language.label")}
        className="rounded-md border border-line bg-ink px-2 py-2 text-xs text-gray-200 outline-none transition hover:border-indigo-500/50 focus:border-indigo-500"
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.nativeName}
          </option>
        ))}
      </select>
    </label>
  );
}
