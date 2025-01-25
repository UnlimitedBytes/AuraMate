/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { AIProvider } from "./types";

export class OllamaProvider implements AIProvider {
    async makeRequest(text: string, prompt: string, apiKey: string, model: string): Promise<string> {
        const host = apiKey || "http://localhost:11434";
        const response = await fetch(`${host}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model,
                messages: [
                    { role: "system", content: prompt },
                    { role: "user", content: text }
                ]
            })
        });
        const data = await response.json();
        return data.message.content;
    }

    async getModels(apiKey: string): Promise<string[]> {
        const host = apiKey || "http://localhost:11434";
        const response = await fetch(`${host}/api/models`);
        const data = await response.json();
        return data.models;
    }
}
