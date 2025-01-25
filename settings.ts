/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { definePluginSettings } from "@api/Settings";
import { OptionType, PluginSettingSelectOption } from "@utils/types";

import { providers } from "./providers";

export async function getModelOptions(): Promise<readonly PluginSettingSelectOption[]> {
    const { provider, apiKey } = settings.store;
    if (!provider || !apiKey) return [];
    try {
        const selectedProvider = providers[provider];
        if (!selectedProvider) return [];

        const modelIds = await selectedProvider.getModels(apiKey);
        return modelIds.map(id => ({
            label: id,
            value: id,
            description: `${provider} model`,
            default: id.includes("default") || id.includes("3.5")
        }));
    } catch (e) {
        console.error("Failed to fetch models:", e);
        return [];
    }
}

// Default empty options for initial render
const defaultModelOptions: readonly PluginSettingSelectOption[] = [];

export const settings = definePluginSettings({
    provider: {
        type: OptionType.SELECT,
        description: "AI Provider to use for enhancement features",
        options: [
            { label: "OpenAI", value: "openai", default: true },
            { label: "Anthropic", value: "anthropic" },
            { label: "Google Gemini", value: "gemini" },
            { label: "DeepSeek", value: "deepseek" },
            { label: "OpenRouter", value: "openrouter" },
            { label: "Vertex AI", value: "vertex" },
            { label: "Mistral AI", value: "mistral" },
            { label: "Ollama", value: "ollama" },
            { label: "LM Studio", value: "lmstudio" },
            { label: "Amazon Bedrock", value: "bedrock" }
        ] as const,
        onChange: async newValue => {
            const models = await getModelOptions();
            const defaultModel = models.find(m => m.default)?.value ?? models[0]?.value;
            settings.store.model = defaultModel;
        }
    },
    apiKey: {
        type: OptionType.STRING,
        description: "API key for the selected provider",
        default: "",
        placeholder: "Enter your API key here"
    },
    model: {
        type: OptionType.SELECT,
        description: "AI model to use for the selected provider",
        options: defaultModelOptions
    },
    enhanceBeforeSend: {
        type: OptionType.BOOLEAN,
        description: "Automatically enhance messages before sending",
        default: false
    },
    enhancementAlert: {
        type: OptionType.BOOLEAN,
        description: "Show alert when enabling auto-enhancement",
        default: true
    },
    enhancementTooltip: {
        type: OptionType.BOOLEAN,
        description: "Show tooltip when auto-enhancement is enabled",
        default: true
    },
    correctSpelling: {
        type: OptionType.BOOLEAN,
        description: "Enable automatic spelling correction",
        default: false
    },
    summarize: {
        type: OptionType.BOOLEAN,
        description: "Enable automatic summarization",
        default: false
    },
    expand: {
        type: OptionType.BOOLEAN,
        description: "Enable automatic expansion",
        default: false
    },
    genZ: {
        type: OptionType.BOOLEAN,
        description: "Enable Gen-Z mode transformation",
        default: false
    },
    showAIButton: {
        type: OptionType.BOOLEAN,
        description: "Show AI button in chat",
        default: true
    }
}).withPrivateSettings<{
    lastUsedFeature: string;
}>();
