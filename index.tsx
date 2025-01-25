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

import "./styles.css";

import { addChatBarButton, removeChatBarButton } from "@api/ChatButtons";
import { findGroupChildrenByChildId, NavContextMenuPatchCallback } from "@api/ContextMenu";
import { addAccessory, removeAccessory } from "@api/MessageAccessories";
import { addPreSendListener, removePreSendListener } from "@api/MessageEvents";
import { addButton, removeButton } from "@api/MessagePopover";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { ChannelStore, React, showToast, Toasts } from "@webpack/common";

import { findByProps } from "../../webpack";
import { AIAccessory, EnhancedMessage, handleEnhance } from "./AIAccessory";
import { AIChatBarIcon, AIIcon } from "./AIIcon";
import { settings } from "./settings";
import { enhanceText } from "./utils";

const ContextMenu = findByProps("MenuItem", "MenuGroup");

const messageCtxPatch: NavContextMenuPatchCallback = (children, props) => {
    const message = props.message as EnhancedMessage;
    if (!message?.content) return;

    const group = findGroupChildrenByChildId("copy-text", children);
    if (!group) return;

    group.splice(group.findIndex(c => c?.props?.id === "copy-text") + 1, 0,
        <ContextMenu.MenuItem
            id="ai-enhance"
            label="AI Enhance"
            icon={AIIcon}
        >
            <ContextMenu.MenuItem
                id="ai-correct-spelling"
                label="Correct Spelling"
                action={async () => {
                    if (!message.content) return;
                    const result = await enhanceText(message.content, "correctSpelling");
                    handleEnhance(message, "spelling", result.enhancedText);
                }}
            />
            <ContextMenu.MenuItem
                id="ai-summarize"
                label="Summarize"
                action={async () => {
                    if (!message.content) return;
                    const result = await enhanceText(message.content, "summarize");
                    handleEnhance(message, "summary", result.enhancedText);
                }}
            />
            <ContextMenu.MenuItem
                id="ai-expand"
                label="Expand"
                action={async () => {
                    if (!message.content) return;
                    const result = await enhanceText(message.content, "expand");
                    handleEnhance(message, "expansion", result.enhancedText);
                }}
            />
            <ContextMenu.MenuItem
                id="ai-genz"
                label="Gen-Z Mode"
                action={async () => {
                    if (!message.content) return;
                    const result = await enhanceText(message.content, "genZ");
                    handleEnhance(message, "expansion", result.enhancedText);
                }}
            />
        </ContextMenu.MenuItem>
    );
};

export default definePlugin({
    name: "AuraMate",
    description: "Enhance your Discord messaging experience with AI-powered features",
    authors: [Devs.unlimitedbytes],
    dependencies: ["MessageAccessoriesAPI", "MessagePopoverAPI", "MessageEventsAPI", "ChatInputButtonAPI"],
    settings,
    contextMenus: {
        "message": messageCtxPatch
    },
    enhanceText,

    start() {
        addAccessory("vc-ai-enhancement", props => (
            <AIAccessory message={props.message as EnhancedMessage} />
        ));

        addChatBarButton("vc-ai", AIChatBarIcon);

        addButton("vc-ai", message => {
            if (!message.content) return null;

            return {
                label: "AI Enhance",
                icon: AIIcon,
                message,
                channel: ChannelStore.getChannel(message.channel_id),
                onClick: () => {
                    const enhancedMessage = message as EnhancedMessage;
                    if (!enhancedMessage.content) return;

                    ContextMenu.openContextMenu(event => (
                        <ContextMenu.Menu onClose={() => ContextMenu.closeContextMenu()}>
                            <ContextMenu.MenuItem
                                id="ai-correct-spelling"
                                label="Correct Spelling"
                                action={async () => {
                                    ContextMenu.closeContextMenu();
                                    const result = await enhanceText(enhancedMessage.content!, "correctSpelling");
                                    handleEnhance(enhancedMessage, "spelling", result.enhancedText);
                                }}
                            />
                            <ContextMenu.MenuItem
                                id="ai-summarize"
                                label="Summarize"
                                action={async () => {
                                    ContextMenu.closeContextMenu();
                                    const result = await enhanceText(enhancedMessage.content!, "summarize");
                                    handleEnhance(enhancedMessage, "summary", result.enhancedText);
                                }}
                            />
                            <ContextMenu.MenuItem
                                id="ai-expand"
                                label="Expand"
                                action={async () => {
                                    ContextMenu.closeContextMenu();
                                    const result = await enhanceText(enhancedMessage.content!, "expand");
                                    handleEnhance(enhancedMessage, "expansion", result.enhancedText);
                                }}
                            />
                            <ContextMenu.MenuItem
                                id="ai-genz"
                                label="Gen-Z Mode"
                                action={async () => {
                                    ContextMenu.closeContextMenu();
                                    const result = await enhanceText(enhancedMessage.content!, "genZ");
                                    handleEnhance(enhancedMessage, "expansion", result.enhancedText);
                                }}
                            />
                        </ContextMenu.Menu>
                    ));
                }
            };
        });

        this.preSend = addPreSendListener(async (_, message) => {
            if (!settings.store.enhanceBeforeSend || !message.content) return;

            try {
                if (settings.store.correctSpelling) {
                    const result = await enhanceText(message.content, "correctSpelling");
                    message.content = result.enhancedText;
                }
                if (settings.store.summarize) {
                    const result = await enhanceText(message.content, "summarize");
                    message.content = result.enhancedText;
                }
                if (settings.store.expand) {
                    const result = await enhanceText(message.content, "expand");
                    message.content = result.enhancedText;
                }
                if (settings.store.genZ) {
                    const result = await enhanceText(message.content, "genZ");
                    message.content = result.enhancedText;
                }
            } catch (e) {
                console.error("[AIEnhancer] Enhancement failed:", e);
                // Show error to user and prevent message from being sent
                showToast("Message enhancement failed. Message not sent.", Toasts.Type.FAILURE);
                return { cancel: true }; // This prevents the message from being sent
            }
        });
    },

    stop() {
        removePreSendListener(this.preSend);
        removeChatBarButton("vc-ai");
        removeButton("vc-ai");
        removeAccessory("vc-ai-enhancement");
        removePreSendListener(this.preSend);
        removeChatBarButton("vc-ai");
        removeButton("vc-ai");
        removeAccessory("vc-ai-enhancement");
    }
});
