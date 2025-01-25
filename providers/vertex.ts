/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { AIProvider } from "./types";

export class VertexProvider implements AIProvider {
    async makeRequest(text: string, prompt: string, apiKey: string, model: string): Promise<string> {
        const [projectId, location = "us-central1"] = apiKey.split(":");
        const response = await fetch(
            `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:predict`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${await this.getAccessToken()}`
                },
                body: JSON.stringify({
                    instances: [{
                        context: prompt,
                        examples: [],
                        messages: [{ content: text }]
                    }]
                })
            }
        );
        const data = await response.json();
        return data.predictions[0].candidates[0].content;
    }

    async getModels(apiKey: string): Promise<string[]> {
        const [projectId, location = "us-central1"] = apiKey.split(":");
        const response = await fetch(
            `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/models`,
            {
                headers: {
                    "Authorization": `Bearer ${await this.getAccessToken()}`
                }
            }
        );
        const data = await response.json();
        return data.models.map(m => m.name);
    }

    private async getAccessToken(): Promise<string> {
        // This assumes running in a GCP environment with default credentials
        const response = await fetch("http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token", {
            headers: { "Metadata-Flavor": "Google" }
        });
        const data = await response.json();
        return data.access_token;
    }
}
