import React from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useTranslation } from "../hooks/useTranslation";
import { useApp } from "../contexts/AppContext";

export default function Welcome() {
  const [, setLocation] = useLocation();
  const { t, changeLanguage } = useTranslation();
  const { updateUserProfile } = useApp();

  const handleLanguageSelect = (language: "en-NG" | "fr-CI") => {
    changeLanguage(language);
    updateUserProfile({ language });
    setLocation("/onboarding");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="animate-fadeIn">
        <Card className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <CardContent className="space-y-6">
            {/* App Icon */}
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center animate-pulse-soft">
              <svg
                className="w-16 h-16 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>

            {/* Welcome Text */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3 mb-2">
                <img
                  src="/attached_assets/logo.png"
                  alt="NaijaReset Logo"
                  className="w-8 h-8 rounded-full"
                />
                <h1 className="text-3xl font-poppins font-bold text-gray-800 dark:text-gray-100">
                  NaijaReset
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {t("welcome.subtitle")}
              </p>
            </div>

            {/* Language Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-poppins font-semibold text-gray-800 dark:text-gray-100">
                {t("welcome.chooseLanguage")}
              </h2>

              <div className="space-y-3">
                <Button
                  onClick={() => handleLanguageSelect("en-NG")}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-4 px-6 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center space-x-3">
                    <span className="text-2xl">🇳🇬</span>
                    <span>{t("welcome.english")}</span>
                  </span>
                </Button>

                <Button
                  onClick={() => handleLanguageSelect("fr-CI")}
                  className="w-full bg-secondary hover:bg-secondary/90 text-white py-4 px-6 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center space-x-3">
                    <span className="text-2xl">🇨🇮</span>
                    <span>{t("welcome.french")}</span>
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
