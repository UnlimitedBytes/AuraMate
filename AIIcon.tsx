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

import { ChatBarButton } from "@api/ChatButtons";
import { classes } from "@utils/misc";
import { openModal } from "@utils/modal";
import { Alerts, Forms, React, Tooltip, useEffect, useState } from "@webpack/common";

import { AiModal } from "./AIModal";
import { settings } from "./settings";
import { cl } from "./utils";

export const AIIcon = ({ height = 24, width = 24, className }: { height?: number; width?: number; className?: string; }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        height={height}
        width={width}
        className={classes(cl("icon"), className)}
        fill="none"
        stroke="currentColor"
        viewBox="-40 -40 480 480"
    >
        <g
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={0.9}
            strokeWidth={4.4}
        >
            <path d="M97.836 54.668c79.363 4.863 115.202-1.679 140.207-1.679 23.255 0 34.197 76.476 24.64 99.059-9.011 21.293-162.352 22.148-169.491 13.715-8.256-9.755-3.482-50.488-3.482-64.462M98.332 190.694c-108.992 100.791 22.918 82.804 49.901 104.389" />
            <path d="M98.33 190.694c1.462 23.008 2.834 75.003 1.933 82.204M208.308 136.239v-12.843M177.299 137.271c-.264-3.388.001-11.15.001-13.875M203.398 241.72c148.699-1.799 171.483-14.99 109.126 100.131M285.55 345.448c-88.74-3.598-148.699 28.781-107.327-80.944" />
            <path d="M180.018 345.448c-19.248-14.063-40.716-25.235-59.36-40.773M218.395 190.156c.629 15.406 1.199 30.742 1.199 46.168M218.395 190.156c7.501 11.881 14.575 19.614 23.382 40.171M80.117 119.041c-4.517 1.181-9.068.949-13.676 1.369M59.593 109.469c.06 8.287-.001 16.446-.683 24.617M277.741 115.622c3.414-.354 6.848-.799 10.256-1.367M291.412 104.682c.97 5.427.683 10.93.683 16.411M225.768 116.466c-22.406-2.473-44.111-1.291-65.644 2.102" />
        </g>
        <g
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={0.9}
            strokeWidth={4.4}
        >
            <path d="M97.836 54.668c79.363 4.863 115.202-1.679 140.207-1.679 23.255 0 34.197 76.476 24.64 99.059-9.011 21.293-162.352 22.148-169.491 13.715-8.256-9.755-3.482-50.488-3.482-64.462M98.332 190.694c-108.992 100.791 22.918 82.804 49.901 104.389" />
            <path d="M98.33 190.694c1.462 23.008 2.834 75.003 1.933 82.204M208.308 136.239v-12.843M177.299 137.271c-.264-3.388.001-11.15.001-13.875M203.398 241.72c148.699-1.799 171.483-14.99 109.126 100.131M285.55 345.448c-88.74-3.598-148.699 28.781-107.327-80.944" />
            <path d="M180.018 345.448c-19.248-14.063-40.716-25.235-59.36-40.773M218.395 190.156c.629 15.406 1.199 30.742 1.199 46.168M218.395 190.156c7.501 11.881 14.575 19.614 23.382 40.171M80.117 119.041c-4.517 1.181-9.068.949-13.676 1.369M59.593 109.469c.06 8.287-.001 16.446-.683 24.617M277.741 115.622c3.414-.354 6.848-.799 10.256-1.367M291.412 104.682c.97 5.427.683 10.93.683 16.411M225.768 116.466c-22.406-2.473-44.111-1.291-65.644 2.102" />
        </g>
    </svg>
);

export let setShouldShowAIEnabledTooltip: undefined | ((show: boolean) => void);

export const AIChatBarIcon: ChatBarButton = ({ isMainChat }) => {
    const { enhanceBeforeSend, showAIButton } = settings.use(["enhanceBeforeSend", "showAIButton"]);

    const [shouldShowAIEnabledTooltip, setter] = useState(false);
    useEffect(() => {
        setShouldShowAIEnabledTooltip = setter;
        return () => setShouldShowAIEnabledTooltip = undefined;
    }, []);

    if (!isMainChat || !showAIButton) return null;

    const toggle = () => {
        const newState = !enhanceBeforeSend;
        settings.store.enhanceBeforeSend = newState;
        if (newState && settings.store.enhancementAlert !== false)
            Alerts.show({
                title: "Vencord AI Enhancement Enabled",
                body: <>
                    <Forms.FormText>
                        You just enabled Auto AI Enhancement! Any message <b>will automatically be enhanced</b> before being sent.
                    </Forms.FormText>
                </>,
                confirmText: "Disable Auto-Enhancement",
                cancelText: "Got it",
                secondaryConfirmText: "Don't show again",
                onConfirmSecondary: () => settings.store.enhancementAlert = false,
                onConfirm: () => settings.store.enhanceBeforeSend = false,
                confirmColor: "vc-notification-log-danger-btn",
            });
    };

    const button = (
        <ChatBarButton
            tooltip="Open AI Enhancement Modal"
            onClick={e => {
                if (e.shiftKey) return toggle();

                openModal(props => (
                    <AiModal rootProps={props} />
                ));
            }}
            onContextMenu={toggle}
            buttonProps={{
                "aria-haspopup": "dialog"
            }}
        >
            <div className={cl("chat-button")}>
                <AIIcon className={cl({ "auto-enhance": enhanceBeforeSend, "icon": true })} />
            </div>
        </ChatBarButton>
    );

    if (shouldShowAIEnabledTooltip && settings.store.enhancementTooltip)
        return (
            <Tooltip text="AI Enhancement Enabled" forceOpen>
                {() => button}
            </Tooltip>
        );

    return button;
};
