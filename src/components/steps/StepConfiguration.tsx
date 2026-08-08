"use client";

import { useEffect, useState } from "react";
import { useClauseGuardStore } from "@/lib/store";
import { Provider } from "@/lib/types";
import { motion } from "framer-motion";
import { Zap, Key, Sparkles } from "lucide-react";

interface StepConfigurationProps {
  onNext: () => void;
}

const PROVIDERS: { label: string; value: Provider }[] = [
  { label: "Groq (free)", value: "Groq" },
  { label: "OpenAI", value: "OpenAI" },
  { label: "Anthropic", value: "Anthropic" },
];

const MODELS: Record<Provider, string[]> = {
  Groq: [
    // Fast & lightweight
    "llama-3.1-8b-instant",

    // General-purpose
    "llama-3.3-70b-versatile",

    // Llama 4
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "meta-llama/llama-4-maverick-17b-128e-instruct",

    // Qwen
    "qwen/qwen3-32b",

    // Kimi
    "moonshotai/kimi-k2-instruct-0905",

    // GPT-OSS
    "openai/gpt-oss-20b",
    "openai/gpt-oss-120b",

    // Gemma
    "gemma-7b-it",

    // Legacy (still available on some accounts)
    "mixtral-8x7b-32768",
    "llama3-8b-8192",
    "llama3-70b-8192",
    "llama2-70b-4096",
  ],

  OpenAI: [
    "gpt-4",
    "gpt-4-turbo",
    "gpt-4o",
    "gpt-3.5-turbo",
  ],

  Anthropic: [
    "claude-3-opus",
    "claude-3-sonnet",
    "claude-3-haiku",
    "claude-3-5-sonnet-20240620",
  ],
};

export function StepConfiguration({ onNext }: StepConfigurationProps) {
  const store = useClauseGuardStore();
  const selectedProvider = store.provider;
  const availableModels = MODELS[selectedProvider];
  // Embedding key is required too now, regardless of which LLM provider is
  // chosen above, since retrieval always calls OpenAI's embeddings API on
  // the backend.
  const isComplete = store.modelName && store.apiKey && store.embeddingApiKey;

  const handleProviderChange = (newProvider: Provider) => {
    store.setProvider(newProvider);
    store.setModelName("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-3xl font-bold text-zinc-900 mb-2">
          LLM Configuration
        </h3>
        <p className="text-sm text-zinc-500">
          Select your preferred AI provider and model for contract analysis.
        </p>
      </div>

      {/* Provider Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-bold text-zinc-900">
          <Zap className="inline w-4 h-4 mr-2" />
          Provider
        </label>
        <div className="grid grid-cols-3 gap-4">
          {PROVIDERS.map((provider) => (
            <motion.button
              key={provider.value}
              onClick={() => handleProviderChange(provider.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`py-4 px-5 rounded-2xl border-2 transition-all text-sm font-bold ${
                selectedProvider === provider.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300"
              }`}
            >
              {provider.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Model Selection */}
      <div className="space-y-4">
        <label htmlFor="model" className="block text-sm font-bold text-zinc-900">
          Model
        </label>
        <select
          id="model"
          value={store.modelName}
          onChange={(e) => store.setModelName(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border-2 border-zinc-200 bg-zinc-50 text-zinc-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-zinc-300 transition-colors"
        >
          <option value="">Select a model...</option>
          {availableModels.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      {/* API Key Input */}
      <div className="space-y-4">
        <label htmlFor="apiKey" className="block text-sm font-bold text-zinc-900">
          <Key className="inline w-4 h-4 mr-2" />
          API Key
        </label>
        <input
          id="apiKey"
          type="password"
          value={store.apiKey}
          onChange={(e) => store.setApiKey(e.target.value)}
          placeholder={`Enter your ${selectedProvider} API key...`}
          className="w-full px-4 py-3 rounded-2xl border-2 border-zinc-200 bg-zinc-50 text-zinc-900 placeholder-zinc-400 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-zinc-300 transition-colors"
        />
        <p className="text-xs text-zinc-500">
          Your API key is never stored or shared. Used only during this session.
        </p>
      </div>

      {/* Embedding API Key Input */}
      <div className="space-y-4">
        <label htmlFor="embeddingApiKey" className="block text-sm font-bold text-zinc-900">
          <Sparkles className="inline w-4 h-4 mr-2" />
          Embedding API Key (Cohere)
        </label>
        <input
          id="embeddingApiKey"
          type="password"
          value={store.embeddingApiKey}
          onChange={(e) => store.setEmbeddingApiKey(e.target.value)}
          placeholder="Enter your Cohere API key..."
          className="w-full px-4 py-3 rounded-2xl border-2 border-zinc-200 bg-zinc-50 text-zinc-900 placeholder-zinc-400 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-zinc-300 transition-colors"
        />
        <p className="text-xs text-zinc-500">
          Used to convert your policy documents and contract clauses into searchable embeddings — this step is separate from the LLM you configured above. Cohere gives every account a free key with 1,000 calls/month, no credit card required.{" "}
          <a
            href="https://dashboard.cohere.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2"
          >
            Get a free key at dashboard.cohere.com
          </a>
          . Never stored or shared beyond this session.
        </p>
      </div>

      {/* Next Button */}
      <motion.button
        whileHover={isComplete ? { scale: 1.05 } : {}}
        whileTap={isComplete ? { scale: 0.95 } : {}}
        onClick={onNext}
        disabled={!isComplete}
        className={`w-full py-3 px-4 rounded-full font-bold transition-all ${
          isComplete
            ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
            : "bg-zinc-200 text-zinc-400 cursor-not-allowed opacity-50"
        }`}
      >
        Continue to Policy KB
      </motion.button>
    </motion.div>
  );
}