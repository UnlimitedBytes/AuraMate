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

import { classNameFactory } from "@api/Styles";
import { showToast, Toasts } from "@webpack/common";

import { providers } from "./providers";
import { settings } from "./settings";

export const cl = classNameFactory("vc-ai-");

export interface EnhancementResult {
    enhancedText: string;
    type: "spelling" | "summary" | "expansion";
}

export type EnhancementType = "correctSpelling" | "summarize" | "expand" | "genZ";

const enhancementPrompts = {
    correctSpelling: "Fix any spelling or grammar errors in the following text while preserving its meaning:",
    summarize: "Summarize the following text in a concise way while preserving key points:",
    expand: "Expand and elaborate on the following text while maintaining its core message:",
    genZ: "Enhance the following text with gen-z slang, keep the original meaning:"
};


async function makeAIRequest(text: string, prompt: string): Promise<string> {
    if (!settings.store.apiKey) {
        throw new Error("API key is not set. Please configure it in settings.");
    }

    if (!settings.store.provider) {
        throw new Error("No AI provider selected. Please select a provider in settings.");
    }

    if (!settings.store.model) {
        throw new Error("No AI model selected. Please select a model in settings.");
    }

    try {
        const provider = providers[settings.store.provider as keyof typeof providers];
        if (!provider) {
            throw new Error("Selected provider is not implemented");
        }

        return await provider.makeRequest(
            text,
            prompt,
            settings.store.apiKey,
            String(settings.store.model)
        );
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error occurred";
        showToast(`AI Enhancement failed: ${errorMessage}`, Toasts.Type.FAILURE);
        throw e;
    }
}

export async function enhanceText(text: string, type: EnhancementType): Promise<EnhancementResult> {
    try {
        if (!settings.store.apiKey) {
            throw new Error("API key is not set. Please configure it in settings.");
        }

        const enhancedText = await makeAIRequest(text, enhancementPrompts[type]);

        return {
            enhancedText,
            type: type === "correctSpelling" ? "spelling" : type === "summarize" ? "summary" : "expansion"
        };
    } catch (e) {
        const userMessage = e instanceof Error ? e.message : "Something went wrong with AI enhancement";
        showToast(userMessage, Toasts.Type.FAILURE);
        throw e;
    }
}
