/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { AIProvider } from "./types";

export class LMStudioProvider implements AIProvider {
    async makeRequest(text: string, prompt: string, apiKey: string, model: string): Promise<string> {
        const port = apiKey || "1234";
        const response = await fetch(`http://localhost:${port}/v1/chat/completions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: prompt },
                    { role: "user", content: text }
                ]
            })
        });
        const data = await response.json();
        return data.choices[0].message.content;
    }

    async getModels(apiKey: string): Promise<string[]> {
        const port = apiKey || "1234";
        const response = await fetch(`http://localhost:${port}/v1/models`);
        const data = await response.json();
        return data.data.map(model => model.id);
    }
}
