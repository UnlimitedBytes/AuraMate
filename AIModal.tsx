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

import { Margins } from "@utils/margins";
import { ModalCloseButton, ModalContent, ModalHeader, ModalProps, ModalRoot } from "@utils/modal";
import { Forms, SearchableSelect, Switch, TextInput, useState } from "@webpack/common";

import { settings } from "./settings";
import { cl } from "./utils";

function ProviderSelect() {
    const providers = [
        { value: "anthropic", label: "Anthropic" },
        { value: "openai", label: "OpenAI" },
        { value: "google", label: "Google Gemini" },
        { value: "deepseek", label: "DeepSeek" },
        { value: "openrouter", label: "OpenRouter" }
    ];

    return (
        <section className={Margins.bottom16}>
            <Forms.FormTitle tag="h3">Provider</Forms.FormTitle>
            <SearchableSelect
                options={providers}
                value={providers.find(p => p.value === settings.store.provider)}
                placeholder="Select AI Provider"
                maxVisibleItems={5}
                closeOnSelect={true}
                onChange={v => settings.store.provider = v}
            />
        </section>
    );
}

function ModelSelect() {
    const provider = settings.store.provider as keyof typeof modelsByProvider;

    const modelsByProvider = {
        openai: [
            { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
            { value: "gpt-4", label: "GPT-4" }
        ],
        anthropic: [
            { value: "claude-2", label: "Claude 2" },
            { value: "claude-instant", label: "Claude Instant" }
        ],
        google: [
            { value: "gemini-pro", label: "Gemini Pro" }
        ],
        deepseek: [
            { value: "deepseek-chat", label: "DeepSeek Chat" },
            { value: "deepseek-r1", label: "DeepSeek R1" }
        ]
    };

    const models = modelsByProvider[provider] ?? [];

    return (
        <section className={Margins.bottom16}>
            <Forms.FormTitle tag="h3">Model</Forms.FormTitle>
            <SearchableSelect
                options={models}
                value={models.find(m => m.value === settings.store.model)}
                placeholder="Select AI Model"
                maxVisibleItems={5}
                closeOnSelect={true}
                onChange={v => settings.store.model = v}
            />
        </section>
    );
}

function ApiKeyInput() {
    return (
        <section className={Margins.bottom16}>
            <Forms.FormTitle tag="h3">API Key</Forms.FormTitle>
            <TextInput
                type="password"
                value={settings.store.apiKey}
                onChange={v => settings.store.apiKey = v}
                placeholder="Enter your API key"
            />
        </section>
    );
}

function FeatureToggles() {
    const [enhance, setEnhance] = useState(settings.store.enhanceBeforeSend);
    const [spelling, setSpelling] = useState(settings.store.correctSpelling);
    const [summarize, setSummarize] = useState(settings.store.summarize);
    const [expand, setExpand] = useState(settings.store.expand);
    const [genZ, setGenZ] = useState(settings.store.genZ);

    return (
        <>
            <Switch
                value={enhance}
                onChange={v => {
                    setEnhance(v);
                    settings.store.enhanceBeforeSend = v;
                }}
                note="Automatically enhance messages before sending"
            >
                Enhance before sending
            </Switch>

            <Switch
                value={spelling}
                onChange={v => {
                    setSpelling(v);
                    settings.store.correctSpelling = v;
                }}
                note="Fix typos and grammatical errors"
            >
                Correct Spelling
            </Switch>

            <Switch
                value={summarize}
                onChange={v => {
                    setSummarize(v);
                    settings.store.summarize = v;
                }}
                note="Convert long text into concise summaries"
            >
                Summarize
            </Switch>

            <Switch
                value={expand}
                onChange={v => {
                    setExpand(v);
                    settings.store.expand = v;
                }}
                note="Elaborate on short messages"
            >
                Expand
            </Switch>

            <Switch
                value={genZ}
                onChange={v => {
                    setGenZ(v);
                    settings.store.genZ = v;
                }}
                note="Transform messages into Gen-Z style"
            >
                Gen-Z Mode
            </Switch>
        </>
    );
}

export function AiModal({ rootProps }: { rootProps: ModalProps; }) {
    return (
        <ModalRoot {...rootProps}>
            <ModalHeader className={cl("modal-header")}>
                <Forms.FormTitle tag="h2">
                    AuraMate Settings
                </Forms.FormTitle>
                <ModalCloseButton onClick={rootProps.onClose} className={cl("dismiss")} />
            </ModalHeader>

            <ModalContent className={cl("modal-content")}>
                <Forms.FormSection>
                    <Forms.FormText className={Margins.bottom16} style={{ color: "var(--text-danger)" }}>
                        ⚠️ Disclaimer: This plugin uses external AI APIs. Any text you send will be processed by third-party services.
                        Please review the privacy policies of your selected provider before use.
                    </Forms.FormText>
                </Forms.FormSection>

                <Forms.FormSection title="Provider Settings">
                    <ProviderSelect />
                    <ApiKeyInput />
                    <ModelSelect />
                </Forms.FormSection>

                <Forms.FormDivider className={Margins.bottom16 + " " + Margins.top16} />

                <Forms.FormSection title="Feature Settings">
                    <FeatureToggles />
                </Forms.FormSection>
            </ModalContent>
        </ModalRoot>
    );
}
